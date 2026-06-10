import { create } from 'zustand';

interface EcommerceSidebarStore {
  sidebarIndex: number;
  setSidebarIndex: (index: number) => void;
}

export const useEcommerceSidebarStore = create<EcommerceSidebarStore>()((set) => ({
  sidebarIndex: 0,
  setSidebarIndex: (index) => set({ sidebarIndex: index }),
}));