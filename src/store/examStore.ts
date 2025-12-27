import { create } from "zustand";
import { ExamAnswers } from "@/lib/gradingEngine";
import { answerKey as initialAnswerKey } from "@/config/answerKey";
import { getAnswerKey, saveAnswerKey } from "@/lib/firebase";

type ExamSection = "reading" | "listening" | "writing" | "results" | "admin";

interface ExamState {
  currentSection: ExamSection;
  answers: ExamAnswers;
  answerKey: typeof initialAnswerKey;
  examPdfUrl: string | null;
  isSubmitted: boolean;
  isLoadingKey: boolean;
  setSection: (section: ExamSection) => void;
  setAnswer: (section: keyof ExamAnswers, question: string, value: string) => void;
  updateAnswerKey: (newKey: typeof initialAnswerKey) => Promise<boolean>;
  setExamPdfUrl: (url: string | null) => Promise<void>;
  fetchAnswerKey: () => Promise<void>;
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
  examPdfUrl: null,
  isSubmitted: false,
  isLoadingKey: false,
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
  updateAnswerKey: async (newKey) => {
    // Optimistic update
    set({ answerKey: newKey });
    // Save to Firebase
    // We need to pass the current pdfUrl as well to match the type, or update saveAnswerKey to accept partials
    // Current firebase signature takes ExamConfig which is answerKey & { pdfUrl? }
    // We should probably update the store structure slightly or merge it here.

    // Quick fix: get current state to merge
    const currentPdfUrl = useExamStore.getState().examPdfUrl;
    // Firestore does not like undefined, use delete or null.
    // If we simply omit it, setDoc with merge:true should preserve it IF it exists, 
    // but if we want to overwrite it we should be explicit.
    // However, here we are constructing the object to save.
    // Let's use delete operator if undefined to completely remove key from object if that's safer,
    // or just pass null/string. 
    // Typescript might complain if we pass null to optional string.

    // Better approach:
    const configToSave: any = { ...newKey };
    if (currentPdfUrl) {
      configToSave.pdfUrl = currentPdfUrl;
    }

    const success = await saveAnswerKey(configToSave);
    if (!success) {
      console.error("Failed to save answer key to Firebase");
      throw new Error("Failed to save to Firestore");
    }
    return success;
  },
  setExamPdfUrl: async (url) => {
    set({ examPdfUrl: url });
    // Construct full config to save
    const currentKey = useExamStore.getState().answerKey;
    const configToSave: any = { ...currentKey };
    if (url) {
      configToSave.pdfUrl = url;
    }
    await saveAnswerKey(configToSave);
  },
  fetchAnswerKey: async () => {
    set({ isLoadingKey: true });
    const config = await getAnswerKey();
    // Separate key and pdfUrl
    const { pdfUrl, ...key } = config;
    set({ answerKey: key as typeof initialAnswerKey, examPdfUrl: pdfUrl || null, isLoadingKey: false });
  },
  submitExam: () => set({ isSubmitted: true, currentSection: "results" }),
  resetExam: () =>
    set({
      currentSection: "reading",
      answers: { reading: {}, listening: {}, writing: {} },
      isSubmitted: false,
    }),
}));
