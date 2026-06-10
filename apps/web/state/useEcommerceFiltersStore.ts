import { create } from "zustand";

export type AvailabilityFilter = "all" | "ready" | "pre-order";
export type ProductTypeFilter = "all" | "qualification" | "unit";

interface EcommerceFiltersStore {
  selectedPackageIds: string[];
  availability: Exclude<AvailabilityFilter, "all">[];
  productType: ProductTypeFilter;
  qualificationLevels: string[];
  setSelectedPackageIds: (packageIds: string[]) => void;
  setAvailability: (availability: Exclude<AvailabilityFilter, "all">[]) => void;
  toggleAvailability: (availability: Exclude<AvailabilityFilter, "all">) => void;
  setProductType: (productType: ProductTypeFilter) => void;
  toggleQualificationLevel: (level: string) => void;
  clearFilters: () => void;
}

export const useEcommerceFiltersStore = create<EcommerceFiltersStore>()((set) => ({
  selectedPackageIds: [],
  availability: [],
  productType: "all",
  qualificationLevels: [],
  setSelectedPackageIds: (selectedPackageIds) => set({ selectedPackageIds }),
  setAvailability: (availability) => set({ availability }),
  toggleAvailability: (availability) => set((state) => ({
    availability: state.availability.includes(availability)
      ? state.availability.filter((item) => item !== availability)
      : [...state.availability, availability],
  })),
  setProductType: (productType) => set({ productType }),
  toggleQualificationLevel: (level) => set((state) => ({
    qualificationLevels: state.qualificationLevels.includes(level)
      ? state.qualificationLevels.filter((item) => item !== level)
      : [...state.qualificationLevels, level],
  })),
  clearFilters: () => set({
    selectedPackageIds: [],
    availability: [],
    productType: "all",
    qualificationLevels: [],
  }),
}));
