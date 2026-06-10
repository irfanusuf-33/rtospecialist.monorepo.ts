// state/usePageLoaderStore.ts
import { create } from 'zustand';

interface PageLoaderStore {
  isLoading: boolean;
  
  // Actions
  setLoading: (loading: boolean) => void;
}

export const usePageLoaderStore = create<PageLoaderStore>()((set) => ({
  isLoading: false,

  setLoading: (loading) => set({ isLoading: loading }),
}));