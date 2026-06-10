import { create } from 'zustand';

interface ProductCategoryPageStore {
  productCategoryPage: unknown;
  categorySubcategories: unknown[];
  productUUIDS: string | unknown;
  categorySelected: boolean;
  activePage: number;
  totalPages: number;

  setProductCategoryPage: (page: number | unknown) => void;
  setCategorySubcategories: (subcategories: unknown[]) => void;
  setProductUUIDS: (uuids: string[] | unknown) => void;
  setCategorySelected: (selected: boolean) => void;
  setActivePage: (page: number) => void;
  setTotalPages: (pages: number) => void;
}

export const useProductCategoryPageStore = create<ProductCategoryPageStore>()((set) => ({
  productCategoryPage: null,
  categorySubcategories: [],
  productUUIDS: null,
  categorySelected: false,
  activePage: 1,
  totalPages: 1,

  setProductCategoryPage: (page) => set({ productCategoryPage: page }),
  setCategorySubcategories: (subcategories) => set({ categorySubcategories: subcategories }),
  setProductUUIDS: (uuids) => set({ productUUIDS: uuids }),
  setCategorySelected: (selected) => set({ categorySelected: selected }),
  setActivePage: (page) => set({ activePage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
}));
