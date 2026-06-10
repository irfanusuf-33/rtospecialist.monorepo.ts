import { create } from 'zustand';

interface GlobalToastState {
  html: string;
  show?: boolean;
  type?: string;
}

interface GlobalToastStore {
  toastState: GlobalToastState;
  setToastState: (state: GlobalToastState) => void;
  showToast: (html: string) => void;
  hideToast: () => void;
}

export const useGlobalToastStore = create<GlobalToastStore>()((set) => ({
  toastState: {
    html: '',
    show: false,
    type:'',
  },

  setToastState: (state) => set({ toastState: state }),
  showToast: (html) => set({ toastState: { html, show: true } }),
  hideToast: () => set({ toastState: { html: '', show: false } }),
}));