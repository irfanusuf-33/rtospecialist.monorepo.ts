// state/useAccountsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AbnDetails {
  abn: string;
  entity: string;
  gst: string;
  location: string;
  status: string;
  type: string;
}

interface Customer {
  isAuthenticated?: boolean;
  accountType?: string;
  credits?: number;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  abnDetails?: AbnDetails;
  certCredits?: number;
  createdAt?: string;
  staff?: number;
  phoneVerified?: boolean | string;
  [key: string]: unknown | undefined;
}

interface AccountsStore {
  customer: Customer ;
  
  // Actions
  setCustomer: (customer: Customer | ((prev: Customer) => Customer)) => void;
  clearCustomer: () => void;
}

export const useAccountsStore = create<AccountsStore>()(
  persist(
    (set) => ({
      customer: {} as Customer,

      // setCustomer: (customer) => set({ customer }),
      setCustomer: (customer) =>set((state) => ({customer:typeof customer === "function"? customer(state.customer): customer,})),

      clearCustomer: () => set({ customer: {} }),
    }),
    {
      name: 'accounts-storage', // localStorage key
      skipHydration: true, // Important for Next.js SSR
    }
  )
);