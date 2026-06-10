"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import GppGoodIcon from '@mui/icons-material/GppGood';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import creditCardIcon from "../../../assets/creditCardIcon.svg";
import jcb from "../../../assets/jcb.png";
import visa from "../../../assets/visa.png";
import americanexp from "../../../assets/americanexp.png";
import mastercard from "../../../assets/mastercard.png";
import { usePageLoaderStore } from "../../../state/usePageLoaderStore";
import { useStripe, useElements, Elements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import lockIcon from "../../../assets/lock-icon.svg";
import PaymentMethods from "./PaymentMethods";
import CardTileSkeleton from "../../common/skeleton/CardTileSkeleton";
import { useModalStore } from "../../../state/useModalStore";
import { useAccountsStore } from "../../../state/useAccountsStore";
import Image from "next/image";
import URLUtils from "../../../scripts/UrlUtils";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_PUBLIC_KEY || '');

const planType = [
  {},
  { id: '$249',  name: "BASIC",    amt: "273.90"  },
  { id: '$799',  name: "STARTER",  amt: "878.90"  },
  { id: '$1399', name: "PREMIUM",  amt: "1538.90" },
];

const stripeElementClass = "mt-2 w-full rounded border border-[#d1d5db] bg-[#f8f8f8] p-3 text-sm dark:border-slate-600 dark:bg-slate-800";
const cardInputLabel = "text-sm font-medium text-[#374151] dark:text-slate-300";
const paymentBtn = "relative w-full rounded-md bg-[#1D1D1D] py-[10px] text-sm font-medium text-white transition-colors hover:bg-black disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-700";

interface PaymentFormProps {
  plan: number;
  handleOpen1: (e?: React.MouseEvent<HTMLElement> | boolean) => void;
  updateCustomerData: () => void;
  pdMembershipPayload?: {
    totalPdUsersWithCertification: number;
    totalPdUsers: number;
  };
}

const PaymentForm = ({ plan, handleOpen1, updateCustomerData, pdMembershipPayload }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const setLoader = usePageLoaderStore((state) => state.setLoading);
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
    setLoader(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: { name },
    });
    if (error) { setLoader(false); return; }
    try {
      const payload = { id: planType[plan]?.name, cardId: paymentMethod.id, paymentMethodId: null };
      const requestPayload = pdMembershipPayload
        ? { totalPdUsersWithCertification: pdMembershipPayload.totalPdUsersWithCertification, totalPdUsers: pdMembershipPayload.totalPdUsers, pid: payload }
        : { pid: payload };
      const res = await URLUtils.post('Payment-ProfessionalDevMemb', requestPayload);
      if (res.status === 200) {
        updateCustomerData();
        handleOpen1(false);
        setSuccessModal({ show: true, content: 'professional development membership.' });
      }
    } catch {
      return;
    } finally {
      setLoader(false);
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
            <CardNumberElement onChange={handleCardNumberChange} id="card-number" className={stripeElementClass} />
            {card ? (
              <div className="absolute right-6 top-10">
                <Image src={cardType[card as keyof typeof cardType].src} alt="card brand" width={44} height={28} />
              </div>
            ) : (
              <div className="absolute right-[28%] top-[45px] flex items-end lg:right-[20%]">
                <Image src={visa.src} alt="Visa" width={35} height={22} />
                <Image src={mastercard.src} alt="Mastercard" width={35} height={22} />
                <Image src={americanexp.src} alt="Amex" width={35} height={22} />
                <Image src={jcb.src} alt="JCB" width={35} height={22} />
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

interface AddPaymentMethodProps {
  open1: boolean;
  handleOpen1: (e?: React.MouseEvent<HTMLElement> | boolean) => void;
  plan: number;
  pdMembershipPayload?: {
    totalPdUsersWithCertification: number;
    totalPdUsers: number;
  };
}

export default function AddPaymentMethod({ open1, handleOpen1, plan, pdMembershipPayload }: AddPaymentMethodProps) {
  const cardType = { visa, mastercard, americanexp, jcb };

  const [cards, setCards] = useState<[]>([]);
  const [hasNoCards, setHasNoCards] = useState(true);
  const [toBeChargedCard, setToBeChargedCard] = useState('');
  const setLoader = usePageLoaderStore((state) => state.setLoading);
  const setSuccessModal = useModalStore((state) => state.setMembershipModal);
  const customer = useAccountsStore((state) => state.customer);
  const setCustomer = useAccountsStore((state) => state.setCustomer);

  const updateCustomerData = () => {
    if (planType[plan]?.name === 'BASIC') {
      setCustomer({ ...customer, certCredits: (customer.certCredits || 0) + 7 });
    } else if (planType[plan]?.name === 'STARTER') {
      setCustomer({ ...customer, staff: (customer.staff || 0) + 5 });
    } else if (planType[plan]?.name === 'PREMIUM') {
      setCustomer({ ...customer, staff: (customer.staff || 0) + 10 });
    }
  };

  const payload = { id: planType[plan]?.name, cardId: toBeChargedCard, paymentMethodId: null };

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
      setLoader(true);
      const requestPayload = pdMembershipPayload
        ? { totalPdUsersWithCertification: pdMembershipPayload.totalPdUsersWithCertification, totalPdUsers: pdMembershipPayload.totalPdUsers, pid: payload }
        : { pid: payload };
      const res = await URLUtils.post('Payment-ProfessionalDevMemb', requestPayload);
      if (res.status === 200) {
        updateCustomerData();
        handleOpen1();
        setSuccessModal({ show: true, content: 'professional development membership.' });
      }
    } catch (e: unknown) {
      const err = e as { response?: { data?: { errorCode?: string } } };
      if (err.response?.data?.errorCode === 'PAYMENTMETHOD_NOT_FOUND') handleOpen1();
    } finally {
      setLoader(false);
    }
  };

  return (
    <Dialog.Root open={open1} onOpenChange={(open) => !open && handleOpen1()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white outline-none dark:bg-slate-900 sm:w-full">
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
                <h3 className="mx-0 mb-1 mt-8 text-center text-sm font-medium text-[#374151] dark:text-slate-300">
                  Professional development membership.
                </h3>
                <div className="mt-0.5 text-center">
                  <p className="mb-1 text-4xl font-semibold text-[#1f2937] dark:text-white">{planType[plan]?.id}</p>
                  <p className="mt-1 text-sm text-[#374151] dark:text-slate-400">+10% GST</p>
                  <p className="mb-1 text-4xl font-semibold text-[#1f2937] dark:text-white">${planType[plan]?.amt}</p>
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

                {toBeChargedCard && (
                  <div className="relative mb-4">
                    <Image src={lockIcon} className="absolute right-6 top-[20%] z-10" alt="lock icon" width={16} height={16} />
                    <button onClick={activateMembership} type="submit" className={paymentBtn}>Place Order</button>
                  </div>
                )}

                <Elements stripe={stripePromise}>
                  <PaymentForm
                    plan={plan}
                    handleOpen1={handleOpen1}
                    updateCustomerData={updateCustomerData}
                    pdMembershipPayload={pdMembershipPayload}
                  />
                </Elements>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
