import { create } from 'zustand';

interface GtmStore {
  activeConsultingLead: string;
  setActiveConsultingLead: (lead: string) => void;
}

export const useGtmStore = create<GtmStore>()((set) => ({
  activeConsultingLead: 'direct',
  setActiveConsultingLead: (lead) => set({ activeConsultingLead: lead }),
}));