import { create } from "zustand";
import URLUtils from "@/scripts/UrlUtils";

export interface TrainingSubcategory {
  _id: string;
  name: string;
}

export interface TrainingCategory {
  _id: string;
  name: string;
  abbreviation?: string;
  subLinks?: TrainingSubcategory[];
}

interface TrainingCategoryResponse {
  _id: string;
  name: string;
  abbreviation?: string;
  subLinks?: Array<TrainingSubcategory | string>;
}

interface TrainingResourcesStore {
  categories: TrainingCategory[];
  hasLoadedCategories: boolean;
  isLoadingCategories: boolean;
  fetchCategories: () => Promise<TrainingCategory[]>;
}

export const useTrainingResourcesStore = create<TrainingResourcesStore>((set, get) => ({
  categories: [],
  hasLoadedCategories: false,
  isLoadingCategories: false,
  fetchCategories: async () => {
    const { categories, hasLoadedCategories, isLoadingCategories } = get();

    if (hasLoadedCategories) {
      return categories;
    }

    if (isLoadingCategories) {
      return categories;
    }

    set({ isLoadingCategories: true });

    try {
      const res = await URLUtils.get("Category-Show");

      if (res.status === 200) {
        const nextCategories = (res.data as TrainingCategoryResponse[]).map((category) => ({
          _id: category._id,
          name: category.name,
          abbreviation: category.abbreviation,
          subLinks: Array.isArray(category.subLinks)
            ? category.subLinks.filter(
                (sub): sub is TrainingSubcategory =>
                  typeof sub !== "string" && Boolean(sub?._id) && Boolean(sub?.name)
              )
            : [],
        }));

        set({
          categories: nextCategories,
          hasLoadedCategories: true,
          isLoadingCategories: false,
        });

        return nextCategories;
      }
    } catch {
      set({ isLoadingCategories: false });
      return get().categories;
    }

    set({ isLoadingCategories: false });
    return get().categories;
  },
}));
