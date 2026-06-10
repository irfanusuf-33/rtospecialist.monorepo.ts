import { create } from 'zustand';

interface CourseFileIdStore {
  fileId: string;
  setFileId: (id: string) => void;
}

export const useCourseFileIdStore = create<CourseFileIdStore>()((set) => ({
  fileId: '',
  setFileId: (id) => set({ fileId: id }),
}));