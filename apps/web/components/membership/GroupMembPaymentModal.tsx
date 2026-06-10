"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import GppGoodIcon from '@mui/icons-material/GppGood';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import creditCardIcon from "../../assets/creditCardIcon.svg";
import jcb from "../../assets/jcb.png";
import visa from "../../assets/visa.png";
import americanexp from "../../assets/americanexp.png";
import mastercard from "../../assets/mastercard.png";
import { usePageLoaderStore } from "../../state/usePageLoaderStore";
import { useStripe, useElements, Elements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import lockIcon from "../../assets/lock-icon.svg";
import PaymentMethods from "../professionaldev/pdevmodal/PaymentMethods";
import CardTileSkeleton from "../common/skeleton/CardTileSkeleton";
import { useModalStore } from "../../state/useModalStore";
import { useAccountsStore } from "../../state/useAccountsStore";
import Image from "next/image";
import URLUtils from "../../scripts/UrlUtils";
import type { MembershipAddonPayload } from "./MembershipPlansClient";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_PUBLIC_KEY || '');

const planType = [
  {},
  { id: '$1,200', name: "ESSENTIAL", amt: '1320.00' },
  { id: '$6,400', name: "GROWTH",    amt: '7040.00' },
  { id: '$8,500', name: "ENTERPRISE", amt: '9350.00' },
];

// Shared Stripe element + input styles injected via globals.css / inline on wrapper
const stripeElementClass = "mt-2 w-full rounded border border-[#d1d5db] bg-[#f8f8f8] p-3 text-sm dark:border-slate-600 dark:bg-slate-800";
const cardInputLabel = "text-sm font-medium text-[#374151] dark:text-slate-300";
const paymentBtn = "relative w-full rounded-md bg-[#1D1D1D] py-[10px] text-sm font-medium text-white transition-colors hover:bg-black disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-700";

interface PaymentFormProps {
  plan: number;
  addonPayload: MembershipAddonPayload | null;
  handleOpen1: (value?: boolean) => void;
  updateCustomerData: () => void;
}

const PaymentForm = ({ plan, addonPayload, handleOpen1, updateCustomerData }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const setLoading = usePageLoaderStore((state) => state.setLoading);
  const [card, setCard] = useState('');
  const setSuccessModal = useModalStore((state) => state.setMembershipModal);

  const cardType = { visa, mastercard, americanexp, jcb };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setName(e.target.value);
  };

  const handleCardNumberChange = (event: unknown) => {
    const e = event as { brand?: keyof typeof cardType };
    setCard(e.brand && cardType[e.brand] ? e.brand : '');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim() === '') { setError('please enter your cardholder name'); return; }
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return;
    setLoading(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: { name },
    });
    if (error) { setLoading(false); return; }
    try {
      const payload = {
        id: planType[plan]?.name,
        cardId: paymentMethod.id,
        addons: addonPayload ? {
          pdPackQty: addonPayload.addonPack.qty,
          newUsersQty: addonPayload.newUsers.qty,
          pdUsersQty: addonPayload.pdUsers.qty,
          pdevUsersBought: addonPayload.pdUsers.qty + addonPayload.addonPack.qty * 5,
          addonAmount: addonPayload.addonAmount,
          subtotal: addonPayload.subtotal,
          gstAmount: addonPayload.gstAmount,
          totalAmount: addonPayload.totalAmount,
        } : undefined,
      };
      const res = await URLUtils.post('Payment-GroupMembership', { pid: payload });
      if (res.status === 200) {
        updateCustomerData();
        handleOpen1(false);
        setSuccessModal({ show: true, content: 'General membership.' });
      }
    } catch (error: any) {
      setError(`${error?.response?.data?.message} code:${error?.response?.data.code}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-black dark:text-white">Add new payment method.</p>
      <form onSubmit={handleSubmit} className="rounded border border-[#e5e7eb] px-4 py-8 dark:border-slate-700 lg:px-12">
        <div className="grid gap-6">
          {/* Card Number */}
          <div className="relative">
            <label htmlFor="card-number" className={cardInputLabel}>Card Number</label>
            <CardNumberElement
              onChange={handleCardNumberChange}
              id="card-number"
              className={stripeElementClass}
            />
            {card ? (
              <div className="absolute right-6 top-10">
                <Image src={cardType[card as keyof typeof cardType]} alt="card brand" width={44} height={28} />
              </div>
            ) : (
              <div className="absolute right-[28%] top-[45px] flex items-end lg:right-[20%]">
                <Image src={visa} alt="Visa" width={35} height={22} />
                <Image src={mastercard} alt="Mastercard" width={35} height={22} />
                <Image src={americanexp} alt="Amex" width={35} height={22} />
                <Image src={jcb} alt="JCB" width={35} height={22} />
              </div>
            )}
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className={cardInputLabel}>Expiry Date</label>
              <CardExpiryElement id="expiry" className={stripeElementClass} />
            </div>
            <div>
              <label htmlFor="cvv" className={cardInputLabel}>CVV</label>
              <CardCvcElement id="cvv" className={stripeElementClass} />
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label htmlFor="cardHolderName" className={cardInputLabel}>Cardholder Name</label>
            <input
              value={name}
              onChange={handleNameChange}
              id="cardHolderName"
              className={`${stripeElementClass} block focus:outline-2 focus:outline-[#d1d5db] dark:text-slate-100 dark:placeholder:text-slate-500`}
            />
            {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
          </div>
        </div>

        {/* Submit */}
        <div className="relative mt-6">
          <Image src={lockIcon} className="absolute right-6 top-[22%] z-10" alt="lock icon" width={16} height={16} />
          <button type="submit" disabled={!stripe} className={paymentBtn}>Place Order</button>
        </div>
      </form>
    </div>
  );
};

interface GroupMembPaymentModalProps {
  open1: boolean;
  handleOpen1: (value?: boolean) => void;
  plan: number;
  addonPayload: MembershipAddonPayload | null;
}

export default function GroupMembPaymentModal({ open1, handleOpen1, plan, addonPayload }: GroupMembPaymentModalProps) {
  const cardType = { visa, mastercard, americanexp, jcb };

  const [cards, setCards] = useState<[]>([]);
  const [hasNoCards, setHasNoCards] = useState(true);
  const [toBeChargedCard, setToBeChargedCard] = useState('');
  const setLoading = usePageLoaderStore((state) => state.setLoading);
  const setSuccessModal = useModalStore((state) => state.setMembershipModal);
  const customer = useAccountsStore((state) => state.customer);
  const setCustomer = useAccountsStore((state) => state.setCustomer);
  const [error, setError] = useState(null);

  const updateCustomerData = () => {
    const extraStaff = (addonPayload?.newUsers.qty || 0) + (addonPayload?.pdUsers.qty || 0) + ((addonPayload?.addonPack.qty || 0) * 5);
    const seatsPerPack = planType[plan]?.name === 'ENTERPRISE' ? 15 : 5;
    const totalPdCredits = ((addonPayload?.addonPack.qty || 0) * seatsPerPack) + (addonPayload?.pdUsers.qty || 0);
    const creditsMap: Record<string, number> = { ESSENTIAL: 500, GROWTH: 1000, ENTERPRISE: 1500 };
    const staffMap: Record<string, number> = { ESSENTIAL: 5, GROWTH: 10, ENTERPRISE: 15 };
    const name = planType[plan]?.name || '';
    if (creditsMap[name]) {
      setCustomer({
        ...customer,
        credits: (customer.credits || 0) + creditsMap[name],
        staff: (customer.staff || 0) + staffMap[name] + extraStaff,
        certCredits: (customer.certCredits || 0) + totalPdCredits,
      });
    }
  };

  const payload = {
    id: planType[plan]?.name,
    cardId: toBeChargedCard,
    addons: addonPayload ? {
      pdPackQty: addonPayload.addonPack.qty,
      newUsersQty: addonPayload.newUsers.qty,
      pdUsersQty: addonPayload.pdUsers.qty,
      pdevUsersBought: addonPayload.pdUsers.qty + addonPayload.addonPack.qty * 5,
      addonAmount: addonPayload.addonAmount,
      subtotal: addonPayload.subtotal,
      gstAmount: addonPayload.gstAmount,
      totalAmount: addonPayload.totalAmount,
    } : undefined,
  };

  const subtotalAmount = addonPayload?.subtotal ?? Number(planType[plan]?.id?.replace(/[^0-9.]/g, '') || 0);
  const totalAmount = addonPayload?.totalAmount ?? Number(planType[plan]?.amt || 0);
  const formattedSubtotal = subtotalAmount
    ? `$${subtotalAmount.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : planType[plan]?.id;
  const formattedTotal = totalAmount
    ? `$${totalAmount.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${planType[plan]?.amt}`;

  useEffect(() => {
    if (!open1) return;
    (async () => {
      try {
        const res = await URLUtils.post('Payment-Methods');
        if (res.status === 200) setCards(res.data.cards);
      } catch { /* ignore */ } finally {
        setHasNoCards(false);
      }
    })();
  }, [open1]);

  const handleCard = (e: React.MouseEvent<HTMLElement>) => {
    setToBeChargedCard((e.target as HTMLElement).getAttribute('data-pid') || '');
  };

  const activateMembership = async () => {
    if (!toBeChargedCard) return;
    try {
      setLoading(true);
      const res = await URLUtils.post('Payment-GroupMembership', { pid: payload });
      if (res.status === 200) {
        updateCustomerData();
        handleOpen1();
        setSuccessModal({ show: true, content: 'General membership.' });
      }
    } catch (e: any) {
      setError(`${e.response?.data?.message} code: ${e.response?.data?.code}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open1} onOpenChange={(open) => !open && handleOpen1()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white outline-none dark:bg-slate-900 sm:w-full">
          <Dialog.Title className="sr-only">Group Membership Payment</Dialog.Title>

          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleOpen1()}
                className="flex cursor-pointer items-center gap-1 text-sm font-medium text-[#6b7280] hover:text-black dark:text-slate-400 dark:hover:text-white"
              >
                <KeyboardBackspaceIcon /> Back
              </button>
              <div className="flex items-center gap-1 text-sm font-medium text-[#6b7280] dark:text-slate-400">
                <GppGoodIcon sx={{ color: "#16a34a" }} />
                100% SECURE
              </div>
            </div>

            {/* Divider */}
            <div className="my-4 h-px bg-[#f1f5f9] dark:bg-slate-700" />

            {/* Body */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:px-5">
              {/* Left — plan summary */}
              <div className="col-span-4 rounded border border-[#e5e7eb] bg-white py-5 shadow-[rgba(0,0,0,0.24)_0px_3px_8px] dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-950">
                <div className="mt-12 text-center">
                  <Image src={creditCardIcon} alt="credit card icon" className="mx-auto h-[200px] w-[200px]" width={58} height={58} />
                </div>
                <h3 className="mx-0 mb-1 mt-8 text-center text-sm font-medium text-[#374151] dark:text-slate-300">Group membership.</h3>
                <div className="mt-0.5 text-center">
                  <p className="mb-1 text-4xl font-semibold text-[#1f2937] dark:text-white">{formattedSubtotal}</p>
                </div>
              </div>

              {/* Right — payment */}
              <div className="relative col-span-8 h-[500px] overflow-y-auto lg:mx-1.5 lg:overflow-x-hidden lg:px-1">
                <p className="text-sm font-medium text-[#1D1D1D] dark:text-slate-200">saved payment methods.</p>

                {/* Saved cards */}
                <div className="my-5 flex flex-col gap-4 sm:flex-row">
                  {hasNoCards && Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="w-full sm:w-1/3">
                      <CardTileSkeleton />
                    </div>
                  ))}
                  {cards.map((card, index) => (
                    <div key={index} className="w-full sm:w-1/3">
                      <PaymentMethods card={card} cardType={cardType} handleCard={handleCard} toBeChargedCard={toBeChargedCard} />
                    </div>
                  ))}
                </div>

                {error && <div className="my-2 text-xs text-red-600 dark:text-red-400">{error}</div>}

                {toBeChargedCard && (
                  <div className="relative mb-4">
                    <Image src={lockIcon} className="absolute right-6 top-[20%] z-10" alt="lock icon" width={16} height={16} />
                    <button onClick={activateMembership} type="submit" className={paymentBtn}>Place Order</button>
                  </div>
                )}

                <Elements stripe={stripePromise}>
                  <PaymentForm plan={plan} addonPayload={addonPayload} handleOpen1={handleOpen1} updateCustomerData={updateCustomerData} />
                </Elements>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
