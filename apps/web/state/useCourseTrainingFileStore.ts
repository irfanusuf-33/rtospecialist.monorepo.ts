import { create } from "zustand";

interface CourseTrainingFileStore {
  trainingFileBlob: Blob | null;
  setTrainingFileBlob: (file: Blob | null) => void;
}

export const useCourseTrainingFileStore = create<CourseTrainingFileStore>()((set) => ({
  trainingFileBlob: null,
  setTrainingFileBlob: (file) => set({ trainingFileBlob: file }),
}));
