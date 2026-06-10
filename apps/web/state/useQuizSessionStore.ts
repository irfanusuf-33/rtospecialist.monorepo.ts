import { create } from "zustand";
import type { FinalResult } from "../components/courses/CourseQuizResult";

interface QuizSessionState {
  fileId: string;
  answers: (string | null)[];
  currentQuestionIndex: number;
  showInlineResults: boolean;
  finalResult: FinalResult;
  startedAt: number | null;
  elapsedSeconds: number;
  initializeSession: (fileId: string, questionCount: number) => void;
  setAnswers: (answers: (string | null)[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setShowInlineResults: (value: boolean) => void;
  setFinalResult: (result: FinalResult) => void;
  setElapsedSeconds: (seconds: number) => void;
  resetSession: (fileId?: string) => void;
}

const initialFinalResult: FinalResult = {
  percentage: 0,
  correctAnswers: 0,
  totalQuestions: 0,
};

export const useQuizSessionStore = create<QuizSessionState>()((set) => ({
  fileId: "",
  answers: [],
  currentQuestionIndex: 0,
  showInlineResults: false,
  finalResult: initialFinalResult,
  startedAt: null,
  elapsedSeconds: 0,
  initializeSession: (fileId, questionCount) =>
    set((state) => {
      const isSameQuiz = state.fileId === fileId;
      const nextAnswers = Array.from({ length: questionCount }, (_, index) =>
        isSameQuiz ? state.answers[index] ?? null : null
      );

      return {
        fileId,
        answers: nextAnswers,
        currentQuestionIndex: isSameQuiz
          ? Math.min(state.currentQuestionIndex, Math.max(questionCount - 1, 0))
          : 0,
        showInlineResults: isSameQuiz ? state.showInlineResults : false,
        finalResult: isSameQuiz ? state.finalResult : initialFinalResult,
        startedAt: isSameQuiz ? state.startedAt ?? Date.now() : Date.now(),
        elapsedSeconds: isSameQuiz ? state.elapsedSeconds : 0,
      };
    }),
  setAnswers: (answers) => set({ answers }),
  setCurrentQuestionIndex: (currentQuestionIndex) => set({ currentQuestionIndex }),
  setShowInlineResults: (showInlineResults) => set({ showInlineResults }),
  setFinalResult: (finalResult) => set({ finalResult }),
  setElapsedSeconds: (elapsedSeconds) => set({ elapsedSeconds }),
  resetSession: (fileId) =>
    set((state) => {
      if (fileId && state.fileId !== fileId) {
        return state;
      }

      return {
        fileId: "",
        answers: [],
        currentQuestionIndex: 0,
        showInlineResults: false,
        finalResult: initialFinalResult,
        startedAt: null,
        elapsedSeconds: 0,
      };
    }),
}));
