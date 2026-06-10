import { create } from 'zustand';

interface SingleCertPaymentMeta {
  creditsToAdd?: number;
  priceLabel?: string;
  productLabel?: string;
  successContent?: string;
  successHeading?: string;
  successLink?: string;
  successTag?: string;
}

interface PaymentStore {
  singleCertPaymentType: null | string;
  singleCertPaymentPayload: Record<string, unknown> | null;
  singleCertPaymentMeta: SingleCertPaymentMeta | null;
  setSingleCertPaymentType: (type: string) => void;
  setSingleCertPaymentConfig: (config: {
    type: string;
    payload?: Record<string, unknown> | null;
    meta?: SingleCertPaymentMeta | null;
  }) => void;
}

export const usePaymentStore = create<PaymentStore>()((set) => ({
  singleCertPaymentType: null,
  singleCertPaymentPayload: null,
  singleCertPaymentMeta: null,
  setSingleCertPaymentType: (type) =>
    set({
      singleCertPaymentType: type,
      singleCertPaymentPayload: null,
      singleCertPaymentMeta: null,
    }),
  setSingleCertPaymentConfig: ({ type, payload = null, meta = null }) =>
    set({
      singleCertPaymentType: type,
      singleCertPaymentPayload: payload,
      singleCertPaymentMeta: meta,
    }),
}));
