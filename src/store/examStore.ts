import { create } from "zustand";
import { ExamAnswers } from "@/lib/gradingEngine";

type ExamSection = "reading" | "listening" | "writing" | "results";

interface ExamState {
  currentSection: ExamSection;
  answers: ExamAnswers;
  isSubmitted: boolean;
  setSection: (section: ExamSection) => void;
  setAnswer: (section: keyof ExamAnswers, question: string, value: string) => void;
  submitExam: () => void;
  resetExam: () => void;
}

export const useExamStore = create<ExamState>((set) => ({
  currentSection: "reading",
  answers: {
    reading: {},
    listening: {},
    writing: {},
  },
  isSubmitted: false,
  setSection: (section) => set({ currentSection: section }),
  setAnswer: (section, question, value) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [section]: {
          ...state.answers[section],
          [question]: value,
        },
      },
    })),
  submitExam: () => set({ isSubmitted: true, currentSection: "results" }),
  resetExam: () =>
    set({
      currentSection: "reading",
      answers: { reading: {}, listening: {}, writing: {} },
      isSubmitted: false,
    }),
}));
