import { Controller, Post, Get, Body, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MembershipsService } from './memberships.service';
import { PurchaseGroupMembershipDto } from './dto/purchase-group-membership.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Replace with your core passport guard layer paths

@ApiTags('Memberships Core Controller Engine')
@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post('Payment-GroupMembership')
  @UseGuards(JwtAuthGuard) // Intercepts requests, validates signatures, and appends user entities to the req context
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atomically upgrade or instantiate a company group subscription along with localized addon recharges' })
  @ApiResponse({ status: 200, description: 'All financial checks verified and database mutations committed successfully.' })
  async handleGroupMembershipPayment(
    @Req() req: any,
    @Body() dto: PurchaseGroupMembershipDto,
  ) {
    // Gracefully extract payload profiles passed down through your middleware authentication guards
    const userId = req.user.id;
    const email = req.user.email;
    const name = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim();

    return this.membershipsService.processGroupMembership(userId, email, name, dto);
  }

  @Get('profile/my-account')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Fetch user tier level metrics along with historical credit purchase ledgers' })
  async fetchMyAccountMembershipDetails(@Req() req: any) {
    return this.membershipsService.getMembershipState(req.user.id);
  }
}