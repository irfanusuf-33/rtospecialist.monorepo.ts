import { create } from 'zustand';

interface subLink {
  _id:string;
  name:string;
  url:string;
  disable:boolean
}
interface ProductPrimaryLink {
  _id: string;
  name: string;
  url:string;
  subLinks: subLink[];
  disable:boolean;
  iconUrl:string
}
interface ProductPrimaryLinksStore {
  productPrimaryLinks: ProductPrimaryLink[];
  setProductPrimaryLinks: (links: ProductPrimaryLink[]) => void;
}

export const useProductPrimaryLinksStore = create<ProductPrimaryLinksStore>()((set) => ({
  productPrimaryLinks: [],
  setProductPrimaryLinks: (links) => set({ productPrimaryLinks: links }),
}));