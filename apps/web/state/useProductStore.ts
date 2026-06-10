import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Product {
  _id: string;
  imageUrl?: string;
  productId: string;
  name: string;
  description: string;
  salePrice: number | string;
  price: number | string;
  preOrder?: boolean;
  inCart?: boolean;
  link?:string;
}
interface ProductStore {
  product: Product | null ;
  setProduct: (product: Product) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      product: null,
      setProduct: (product) => set({ product }),
    }),
    {
      name: 'product-storage',
      skipHydration: true,
    }
  )
);