// src/memberships/memberships.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { PurchaseGroupMembershipDto } from './dto/purchase-group-membership.dto';
import { PlanStatus, PlanTier, PlanType } from '@prisma/client';

@Injectable()
export class MembershipsService {
  // Domain pricing parameters matching your legacy constant logic layout matrices
  private readonly TIERS_CONFIG = {
    ESSENTIAL: { basePrice: 750, userPrice: 69, pdPrice: 27, certQty: 25, pdUserQty: 5, unitCredits: 3, envKey: 'GLOBAL_MEMBERSHIP_ESSENTIAL' },
    GROWTH: { basePrice: 1350, userPrice: 59, pdPrice: 25, certQty: 50, pdUserQty: 10, unitCredits: 10, envKey: 'GLOBAL_MEMBERSHIP_GROWTH' },
    ENTERPRISE: { basePrice: 1500, userPrice: 49, pdPrice: 23, certQty: 75, pdUserQty: 15, unitCredits: 20, envKey: 'GLOBAL_MEMBERSHIP_ENTERPRISE' },
  };

  // Simply inject the Prisma Service and our new custom Stripe Service
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService, 
  ) {}

  /**
   * Executes full structural pricing audits on inbound raw addon metrics
   */
  public calculateTierPricing(tierKey: PlanTier, addons: any) {
    const config = this.TIERS_CONFIG[tierKey];
    if (!config) throw new BadRequestException(`Plan tier profile mapping for "${tierKey}" is missing.`);

    let addonCostAggregate = addons.pdPackQty > 0 ? config.basePrice : 0;
    addonCostAggregate += (addons.pdUsersQty * config.pdPrice);
    addonCostAggregate += (addons.newUsersQty * config.userPrice);

    return {
      addonCostAggregate,
      calculatedNewUsersQty: addons.newUsersQty + config.pdUserQty,
      calculatedPdUsersQty: addons.pdUsersQty + config.certQty,
      baseUnitCredits: config.unitCredits,
      stripePriceId: process.env[config.envKey],
    };
  }

  async processGroupMembership(userId: string, email: string, name: string, dto: PurchaseGroupMembershipDto) {
    // Variable reference isolated to stripeClient to bypass explicit structural name collisions
    const stripeClient = this.stripeService.client;
    const pricing = this.calculateTierPricing(dto.id, dto.addons);
    
    if (!pricing.stripePriceId) {
      throw new BadRequestException({
        success: false,
        message: 'priceId for the applied membership was not found inside local configuration keys.',
        code: 'priceId_not_found',
      });
    }

    // 1. Verify alignment bounds and prevent identical multi-purchases
    const activeMembership = await this.prisma.membership.findFirst({
      where: { userId, status: PlanStatus.succeeded },
    });

    if (activeMembership && activeMembership.planTier === dto.id) {
      const recommendation = dto.id === PlanTier.ESSENTIAL ? 'GROWTH' : 'ENTERPRISE';
      throw new BadRequestException({
        success: false,
        message: dto.id === PlanTier.ENTERPRISE 
          ? 'You already have an active ENTERPRISE membership plan activated.'
          : `You already have an active ${dto.id} membership plan activated. We recommend upgrading to ${recommendation}.`,
        code: dto.id === PlanTier.ENTERPRISE ? 'enterprise_active' : 'same_plan_activated',
      });
    }

    // 2. Fetch or provision External Stripe Engine Customer Identities using decoupled service
    let stripeCustomerId = '';
    const customers = await stripeClient.customers.list({ email, limit: 1 });
    if (customers.data.length > 0) {
      stripeCustomerId = customers.data[0].id;
    } else {
      const stripeCustomer = await stripeClient.customers.create({ email, name, metadata: { userId } });
      stripeCustomerId = stripeCustomer.id;
    }

    // Bind card configurations onto Stripe Customer settings
    await stripeClient.paymentMethods.attach(dto.cardId, { customer: stripeCustomerId });
    await stripeClient.customers.update(stripeCustomerId, {
      invoice_settings: { default_payment_method: dto.cardId },
    });

    // RESOLVED: Safe typecasting query pointing directly to Stripe's embedded properties
    let subscription;

    // 3. Routing Engine: Upgrade Subscriptions vs Registering New Instances
    if (activeMembership && activeMembership.membershipId) {
      const fullSub = await stripeClient.subscriptions.retrieve(activeMembership.membershipId);
      const subItemId = fullSub.items.data[0].id;

      subscription = await stripeClient.subscriptions.update(activeMembership.membershipId, {
        items: [{ id: subItemId, price: pricing.stripePriceId }],
        metadata: { uuid: userId, planId: dto.id, group: 'GROUP_MEMB_UPGRADE', unitCredits: pricing.baseUnitCredits.toString() },
        payment_behavior: 'allow_incomplete',
        proration_behavior: 'always_invoice',
        expand: ['latest_invoice.payment_intent'],
      });
    } else {
      subscription = await stripeClient.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: pricing.stripePriceId }],
        metadata: { uuid: userId, planId: dto.id, group: 'GROUP_MEMB', unitCredits: pricing.baseUnitCredits.toString() },
        expand: ['latest_invoice.payment_intent'],
      });
    }

    // RESOLVED: Safe typecasting query pointing directly to Stripe's embedded properties
    let paymentIntentAddon;
    if (pricing.addonCostAggregate > 0) {
      paymentIntentAddon = await stripeClient.paymentIntents.create({
        amount: pricing.addonCostAggregate * 100, // Process standard currency as lowest denomination cents
        currency: 'aud',
        payment_method: dto.cardId,
        customer: stripeCustomerId,
        confirm: true,
        automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
        metadata: {
          type: 'ADDON_WITH_GMEMB',
          uid: userId,
          totalPdUsers: pricing.calculatedNewUsersQty.toString(),
          totalCerts: pricing.calculatedPdUsersQty.toString(),
        },
      });
    }

    // 4. Audit Processing Success metrics
    const subSuccess = subscription.status === 'active' || subscription.status === 'trialing';
    const addonSuccess = pricing.addonCostAggregate > 0 ? paymentIntentAddon?.status === 'succeeded' : true;

    if (subSuccess && addonSuccess) {
      // Execute ACID database updates inside a safe Prisma Transaction block
      return this.prisma.$transaction(async (tx) => {
        const membershipRecord = await tx.membership.upsert({
          where: { id: activeMembership?.id || 'non-existent-fallback-cuid' },
          update: { planTier: dto.id, status: PlanStatus.succeeded, membershipId: subscription.id },
          create: {
            userId,
            type: PlanType.GROUP,
            planTier: dto.id,
            status: PlanStatus.succeeded, 
            membershipId: subscription.id,
            paymentId: (subscription.latest_invoice as any)?.payment_intent?.id || null,
          },
        });

        // Store structural transaction ledger rows tracking addon distributions
        await tx.membershipAddon.create({
          data: {
            membershipId: membershipRecord.id,
            addonType: 'UNIT_CREDIT',
            quantity: pricing.calculatedNewUsersQty,
            status: PlanStatus.succeeded,
            paymentId: paymentIntentAddon?.id || null,
          },
        });

        return { success: true, message: 'Subscription was successfully created and addon initiated successfully.' };
      });
    }

    // If transactions stall out or require 3DS multi-factor validations, return clear errors
    const requiresMfa = subscription?.status === 'requires_action' || paymentIntentAddon?.status === 'requires_action';
    throw new BadRequestException({
      success: false,
      requires_action: requiresMfa,
      message: requiresMfa ? 'Authentication required by financial institution.' : 'Payment settlement declined.',
      code: `payment_failed_action_${requiresMfa}`,
      details: { subscription: subscription?.status, addon: paymentIntentAddon?.status },
    });
  }

  async getMembershipState(userId: string) {
    const profile = await this.prisma.membership.findFirst({
      where: { userId },
      include: { addons: true },
      orderBy: { placedAt: 'desc' },
    });
    if (!profile) throw new NotFoundException(`No tracking membership profile exists for User ID "${userId}".`);
    return profile;
  }
}