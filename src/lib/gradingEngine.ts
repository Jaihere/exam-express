import { answerKey } from "@/config/answerKey";

export interface ExamAnswers {
  reading: Record<string, string>;
  listening: Record<string, string>;
  writing: Record<string, string>;
}

export interface GradingResult {
  reading: SectionResult;
  listening: SectionResult;
  writing: SectionResult;
  totalScore: number;
  totalQuestions: number;
  percentage: number;
}

export interface SectionResult {
  score: number;
  total: number;
  details: QuestionResult[];
}

export interface QuestionResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

const normalizeAnswer = (answer: string): string => {
  return answer.toLowerCase().trim().replace(/\s+/g, " ");
};

const countWords = (text: string): number => {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

export const gradeExam = (answers: ExamAnswers, key: typeof answerKey): GradingResult => {
  // Helper to sort keys naturally (q1, q2, q10)
  const sortKeys = (keys: string[]) => {
    return keys.sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
  };

  // Grade Reading Section
  const readingDetails: QuestionResult[] = [];
  let readingScore = 0;
  const readingKeys = sortKeys(Object.keys(key.reading));

  readingKeys.forEach((qKey) => {
    const qNum = qKey.replace(/\D/g, ''); // Extract number for display
    const userAnswer = answers.reading[qKey as keyof typeof key.reading] || "";
    const correctAnswer = key.reading[qKey as keyof typeof key.reading];
    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);

    if (isCorrect) readingScore++;

    readingDetails.push({
      question: `Q${qNum}`,
      userAnswer: userAnswer || "(No answer)",
      correctAnswer,
      isCorrect,
    });
  });

  // Grade Listening Section
  const listeningDetails: QuestionResult[] = [];
  let listeningScore = 0;
  const listeningKeys = sortKeys(Object.keys(key.listening));

  listeningKeys.forEach((qKey) => {
    const qNum = qKey.replace(/\D/g, '');
    const userAnswer = answers.listening[qKey as keyof typeof key.listening] || "";
    const correctAnswer = key.listening[qKey as keyof typeof key.listening];
    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);

    if (isCorrect) listeningScore++;

    listeningDetails.push({
      question: `Q${qNum}`,
      userAnswer: userAnswer || "(No answer)",
      correctAnswer,
      isCorrect,
    });
  });

  // Grade Writing Section
  const writingDetails: QuestionResult[] = [];
  let writingScore = 0;
  const writingKeys = sortKeys(Object.keys(key.writing));

  writingKeys.forEach((qKey) => {
    const qNum = qKey.replace(/\D/g, '');
    const userAnswer = answers.writing[qKey as keyof typeof key.writing] || "";
    const correctAnswer = key.writing[qKey as keyof typeof key.writing];
    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);

    if (isCorrect) writingScore++;

    writingDetails.push({
      question: `Q${qNum}`,
      userAnswer: userAnswer || "(No answer)",
      correctAnswer,
      isCorrect,
    });
  });

  const totalScore = readingScore + listeningScore + writingScore;
  const totalQuestions = readingKeys.length + listeningKeys.length + writingKeys.length;

  return {
    reading: { score: readingScore, total: readingKeys.length, details: readingDetails },
    listening: { score: listeningScore, total: listeningKeys.length, details: listeningDetails },
    writing: { score: writingScore, total: writingKeys.length, details: writingDetails },
    totalScore,
    totalQuestions,
    percentage: Math.round((totalScore / totalQuestions) * 100),
  };
};
