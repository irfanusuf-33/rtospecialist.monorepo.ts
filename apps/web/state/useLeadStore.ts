// store/useLeadStore.ts
import { create } from 'zustand';

interface LeadStore {
  activeConsultingLead: string;
  setActiveConsultingLead: (lead: string) => void;
}

export const useLeadStore = create<LeadStore>((set) => ({
  activeConsultingLead: '',
  setActiveConsultingLead: (lead) => set({ activeConsultingLead: lead }),
}));