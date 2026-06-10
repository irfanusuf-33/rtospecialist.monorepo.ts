import { create } from "zustand";

export interface StoredProduct {
  _id: string;
  imageUrl?: string;
  productId?: string;
  name: string;
  description?: string;
  salePrice?: number | string;
  price?: number | string;
  preOrder?: boolean;
  inCart?: boolean;
  link?: string;
  group?: string;
  categoryId?: string;
  categoryName?: string;
  subcategory?: string[] | Array<{ _id?: string; name?: string }>;
  category?: string[] | Array<{ _id?: string; name?: string }>;
  fileUploaded?: boolean;
  [key: string]: unknown;
}

interface AllProductsStore {
  productsById: Record<string, StoredProduct>;
  contextProductIds: Record<string, string[]>;
  upsertProduct: (product: StoredProduct, contextKey?: string) => void;
  upsertProducts: (products: StoredProduct[], contextKey?: string) => void;
  setContextProducts: (contextKey: string, products: StoredProduct[]) => void;
  clearContextProducts: (contextKey: string) => void;
  clearAllProducts: () => void;
}

const getUniqueIds = (products: StoredProduct[]) => {
  const seen = new Set<string>();

  return products.reduce<string[]>((ids, product) => {
    if (!product?._id || seen.has(product._id)) {
      return ids;
    }

    seen.add(product._id);
    ids.push(product._id);
    return ids;
  }, []);
};

const mergeProducts = (
  existing: Record<string, StoredProduct>,
  products: StoredProduct[],
) => {
  return products.reduce<Record<string, StoredProduct>>((acc, product) => {
    if (!product?._id) {
      return acc;
    }

    acc[product._id] = {
      ...acc[product._id],
      ...product,
    };

    return acc;
  }, { ...existing });
};

const isStoredProduct = (product: StoredProduct | undefined): product is StoredProduct => (
  Boolean(product?._id)
);

export const useAllProductsStore = create<AllProductsStore>((set) => ({
  productsById: {},
  contextProductIds: {},

  upsertProduct: (product, contextKey) =>
    set((state) => {
      if (!product?._id) {
        return state;
      }

      const nextProductsById = mergeProducts(state.productsById, [product]);

      if (!contextKey) {
        return {
          productsById: nextProductsById,
        };
      }

      const nextContextIds = getUniqueIds([
        ...(state.contextProductIds[contextKey] || [])
          .map((id) => nextProductsById[id])
          .filter(isStoredProduct),
        product,
      ]);

      return {
        productsById: nextProductsById,
        contextProductIds: {
          ...state.contextProductIds,
          [contextKey]: nextContextIds,
        },
      };
    }),

  upsertProducts: (products, contextKey) =>
    set((state) => {
      const validProducts = products.filter(isStoredProduct);

      if (validProducts.length === 0) {
        return state;
      }

      const nextProductsById = mergeProducts(state.productsById, validProducts);

      if (!contextKey) {
        return {
          productsById: nextProductsById,
        };
      }

      const existingProductsForContext = (state.contextProductIds[contextKey] || [])
        .map((id) => nextProductsById[id])
        .filter(isStoredProduct);

      return {
        productsById: nextProductsById,
        contextProductIds: {
          ...state.contextProductIds,
          [contextKey]: getUniqueIds([...existingProductsForContext, ...validProducts]),
        },
      };
    }),

  setContextProducts: (contextKey, products) =>
    set((state) => {
      const validProducts = products.filter(isStoredProduct);

      return {
        productsById: mergeProducts(state.productsById, validProducts),
        contextProductIds: {
          ...state.contextProductIds,
          [contextKey]: getUniqueIds(validProducts),
        },
      };
    }),

  clearContextProducts: (contextKey) =>
    set((state) => ({
      contextProductIds: Object.fromEntries(
        Object.entries(state.contextProductIds).filter(([key]) => key !== contextKey),
      ),
    })),

  clearAllProducts: () =>
    set({
      productsById: {},
      contextProductIds: {},
    }),
}));
