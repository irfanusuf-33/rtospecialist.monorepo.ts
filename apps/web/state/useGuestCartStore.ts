import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GuestCartItem {
  productId: string;
  salePrice: number | string;
  productCode: string;
  price: number | string;
  name: string;
  type: string;
}

interface GuestCartStore {
  products: GuestCartItem[];
  addProduct: (item: GuestCartItem) => void;
  addProducts: (items: GuestCartItem[]) => void;
  removeProduct: (productId: string) => void;
  clearProducts: () => void;
}

const GUEST_CART_STORAGE_KEY = 'guest-cart-storage';

const syncGuestCartStorage = (products: GuestCartItem[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    GUEST_CART_STORAGE_KEY,
    JSON.stringify({
      state: { products },
      version: 0,
    })
  );
};

export const useGuestCartStore = create<GuestCartStore>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (item) =>
        set((state) => {
          const nextProducts = state.products.some((product) => product.productId === item.productId)
            ? state.products
            : [...state.products, item];

          syncGuestCartStorage(nextProducts);

          return {
            products: nextProducts,
          };
        }),
      addProducts: (items) =>
        set((state) => {
          const nextProducts = [...state.products, ...items].filter(
            (item, index, array) =>
              item?.productId &&
              array.findIndex((product) => product.productId === item.productId) === index
          );

          syncGuestCartStorage(nextProducts);

          return {
            products: nextProducts,
          };
        }),
      removeProduct: (productId) =>
        set((state) => {
          const nextProducts = state.products.filter((product) => product.productId !== productId);

          syncGuestCartStorage(nextProducts);

          return {
            products: nextProducts,
          };
        }),
      clearProducts: () => {
        syncGuestCartStorage([]);
        set({ products: [] });
      },
    }),
    {
      name: GUEST_CART_STORAGE_KEY,
      skipHydration: true,
    }
  )
);
