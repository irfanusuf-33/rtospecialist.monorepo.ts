import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MembershipModal {
  show: boolean;
  content: string;
}

interface GeneralSuccessModal {
  show: boolean;
  heading: string;
  content: string;
  link: string;
  tag: string;
  type: number;
}

interface ModalStore {
  mmodal: boolean;
  membershipModal: MembershipModal;
  generalSuccessModal: GeneralSuccessModal;
  referalModal: boolean;

  setMmodal: (state: boolean) => void;
  setMembershipModal: (modal: MembershipModal) => void;
  setGeneralSuccessModal: (modal: GeneralSuccessModal) => void;
  setReferalModal: (state: boolean) => void;
}

export const useModalStore = create<ModalStore>()(
  persist(
    (set) => ({
      mmodal: false,
      membershipModal: {
        show: false,
        content: '',
      },
      generalSuccessModal: {
        show: false,
        heading: '',
        content: '',
        link: '',
        tag: '',
        type: 0
      },
      referalModal: false,

      setMmodal: (state) => set({ mmodal: state }),
      setMembershipModal: (modal) => set({ membershipModal: modal }),
      setGeneralSuccessModal: (modal) => set({ generalSuccessModal: modal }),
      setReferalModal: (state) => set({ referalModal: state }),
    }),
    {
      name: 'modal-storage',
      skipHydration: true,
    }
  )
);