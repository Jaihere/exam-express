import { create } from "zustand";
import { ExamAnswers } from "@/lib/gradingEngine";
import { answerKey as initialAnswerKey } from "@/config/answerKey";

type ExamSection = "reading" | "listening" | "writing" | "results" | "admin";

interface ExamState {
  currentSection: ExamSection;
  answers: ExamAnswers;
  answerKey: typeof initialAnswerKey;
  isSubmitted: boolean;
  setSection: (section: ExamSection) => void;
  setAnswer: (section: keyof ExamAnswers, question: string, value: string) => void;
  updateAnswerKey: (newKey: typeof initialAnswerKey) => void;
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
  answerKey: initialAnswerKey,
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
  updateAnswerKey: (newKey) => set({ answerKey: newKey }),
  submitExam: () => set({ isSubmitted: true, currentSection: "results" }),
  resetExam: () =>
    set({
      currentSection: "reading",
      answers: { reading: {}, listening: {}, writing: {} },
      isSubmitted: false,
    }),
}));
