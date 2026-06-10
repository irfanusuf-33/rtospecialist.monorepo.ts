// store/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  type?: string;
  [key: string]: unknown;
}

interface CartStore {
  items: CartItem[];
  cartPrice: number | null;
  userCartLength: number;
  groupAllInCart: {
    electiveUnits: boolean;
    coreUnits: boolean;
  };
  
  // Actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  emptyCart: () => void;
  setCartPrice: (price: number | null) => void;
  setUserCartLength: (length: number) => void;
  setGroupAllInCart: (group: { electiveUnits: boolean; coreUnits: boolean }) => void;
  setItems: (items: Array<string | CartItem>) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartPrice: null,
      userCartLength: 0,
      groupAllInCart: {
        electiveUnits: false,
        coreUnits: false,
      },

      addToCart: (item) => {
        const currentItems = get().items;
        if (!currentItems.some((i) => i.id === item.id)) {
          const newItems = [...currentItems, item];
          set({ 
            items: newItems,
            userCartLength: newItems.length 
          });
        }
      },

      removeFromCart: (id) => {
        const newItems = get().items.filter((item) => item.id !== id);
        set({ 
          items: newItems,
          userCartLength: newItems.length 
        });
      },

      emptyCart: () => {
        set({ 
          items: [],
          userCartLength: 0 
        });
      },

      setCartPrice: (price) => set({ cartPrice: price }),
      setUserCartLength: (length) => set({ userCartLength: length }),

      setGroupAllInCart: (group) => set({ groupAllInCart: group }),
      setItems: (items) =>
        set({
          items: Array.from(
            new Map(
              items
                .map((item) => (typeof item === 'string' ? { id: item } : item))
                .filter((item) => item?.id)
                .map((item) => [item.id, item])
            ).values()
          ),
        }),
    }),
    {
      name: 'cart-storage', // localStorage key
      skipHydration: true, //Remember ................ Important for Next.js SSR
    }
  )
);
