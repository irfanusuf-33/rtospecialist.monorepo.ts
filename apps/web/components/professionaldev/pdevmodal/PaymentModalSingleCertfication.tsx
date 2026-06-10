"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import GppGoodIcon from '@mui/icons-material/GppGood';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import creditCardIcon from "../../../assets/creditCardIcon.svg";
import jcb from "../../../assets/jcb.png";
import visa from "../../../assets/visa.png";
import amex from "../../../assets/americanexp.png";
import mastercard from "../../../assets/mastercard.png";
import { usePageLoaderStore } from "../../../state/usePageLoaderStore";
import { useStripe, useElements, Elements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import lockIcon from "../../../assets/lock-icon.svg";
import { useAccountsStore } from "../../../state/useAccountsStore";
import { usePaymentStore } from "../../../state/usePaymentStore";
import { useModalStore } from "../../../state/useModalStore";
import URLUtils from "../../../scripts/UrlUtils";
import Image from "next/image";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_PUBLIC_KEY || '');

const stripeElementClass = "mt-2 w-full rounded border border-[#d1d5db] bg-[#f8f8f8] p-3 text-sm dark:border-slate-600 dark:bg-slate-800";
const cardInputLabel = "text-sm font-medium text-[#374151] dark:text-slate-300";
const paymentBtn = "relative w-full rounded-md bg-[#1D1D1D] py-[10px] text-sm font-medium text-white transition-colors hover:bg-black disabled:opacity-50 dark:bg-sky-600 dark:hover:bg-sky-700";

interface PaymentFormProps {
  handleOpen1: (value?: boolean) => void;
  updateCustomerData: () => void;
  paymentURL: string;
  paymentPayload: Record<string, unknown> | null;
  successMeta: {
    successContent?: string;
    successHeading?: string;
    successLink?: string;
    successTag?: string;
  } | null;
}

const PaymentForm = ({ handleOpen1, updateCustomerData, paymentURL, paymentPayload, successMeta }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const setLoading = usePageLoaderStore((state) => state.setLoading);
  const [card, setCard] = useState('');
  const setSuccessModal = useModalStore((state) => state.setGeneralSuccessModal);

  const cardType = { visa, mastercard, amex, jcb };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setName(e.target.value);
  };

  const handleCardNumberChange = (event: unknown) => {
    setError('');
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
    if (error) {
      setError(error.message || 'Unable to process card details. Please try again.');
      setLoading(false);
      return;
    }
    try {
      setError('');
      const payload = { ...(paymentPayload || {}), cardId: paymentMethod.id };
      const res = await URLUtils.post(paymentURL, { pid: payload });
      if (res.status === 200) {
        updateCustomerData();
        handleOpen1(false);
        setSuccessModal({
          show: true,
          heading: successMeta?.successHeading || 'Single certificate program purchased!',
          content: successMeta?.successContent || 'You can now choose any one of the professional development program',
          link: successMeta?.successLink || '/training',
          tag: successMeta?.successTag || 'go to program',
          type: 1,
        });
      }
    } catch (e: unknown) {
      const err = e as { response?: { data?: { err?: string } } };
      setError(err.response?.data?.err || 'some unexpected error occurred. Please contact support.');
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
            <CardNumberElement onChange={handleCardNumberChange} id="card-number" className={stripeElementClass} />
            {card ? (
              <div className="absolute right-6 top-10">
                <Image src={cardType[card as keyof typeof cardType]} alt="card brand" width={44} height={28} />
              </div>
            ) : (
              <div className="absolute right-[28%] top-[45px] flex items-end lg:right-[20%]">
                <Image src={visa} alt="Visa" width={35} height={22} />
                <Image src={mastercard} alt="Mastercard" width={35} height={22} />
                <Image src={amex} alt="Amex" width={35} height={22} />
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
            {error && <span className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</span>}
          </div>
        </div>

        {/* Submit */}
        <div className="relative mt-6">
          <Image src={lockIcon} className="absolute right-6 top-[22%] z-10" alt="lock icon" width={24} height={24} />
          <button type="submit" disabled={!stripe} className={paymentBtn}>Place Order</button>
        </div>

        {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </form>
    </div>
  );
};

interface PaymentModalSingleCertficationProps {
  open1: boolean;
  handleOpen1: (value?: boolean) => void;
}

export default function PaymentModalSingleCertfication({ open1, handleOpen1 }: PaymentModalSingleCertficationProps) {
  const paymentURL = usePaymentStore((state) => state.singleCertPaymentType);
  const paymentPayload = usePaymentStore((state) => state.singleCertPaymentPayload);
  const paymentMeta = usePaymentStore((state) => state.singleCertPaymentMeta);
  const setCustomer = useAccountsStore((state) => state.setCustomer);

  const updateCustomerData = () => {
    setCustomer((prev) => ({
      ...prev,
      certCredits: (prev.certCredits || 0) + (paymentMeta?.creditsToAdd || 1),
    }));
  };

  return (
    <Dialog.Root open={open1} onOpenChange={(open) => !open && handleOpen1(false)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white outline-none dark:bg-slate-900 sm:w-full">
          <Dialog.Title className="sr-only">Professional Development Payment</Dialog.Title>

          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleOpen1(false)}
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
                  {paymentMeta?.productLabel || 'Single Certification'}
                </h3>
                <div className="mt-0.5 text-center">
                  <p className="mb-1 text-4xl font-semibold text-[#1f2937] dark:text-white">
                    {paymentMeta?.priceLabel || 'A$45.00'}
                  </p>
                </div>
              </div>

              {/* Right — payment form */}
              <div className="relative col-span-8 h-[500px] overflow-y-auto lg:mx-1.5 lg:overflow-x-hidden lg:px-1">
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    handleOpen1={handleOpen1}
                    updateCustomerData={updateCustomerData}
                    paymentURL={paymentURL}
                    paymentPayload={paymentPayload}
                    successMeta={paymentMeta}
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
