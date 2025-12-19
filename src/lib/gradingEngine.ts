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

export const gradeExam = (answers: ExamAnswers): GradingResult => {
  // Grade Reading Section
  const readingDetails: QuestionResult[] = [];
  let readingScore = 0;

  for (let i = 1; i <= 15; i++) {
    const key = `q${i}` as keyof typeof answerKey.reading;
    const userAnswer = answers.reading[key] || "";
    const correctAnswer = answerKey.reading[key];
    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);

    if (isCorrect) readingScore++;

    readingDetails.push({
      question: `Q${i}`,
      userAnswer: userAnswer || "(No answer)",
      correctAnswer,
      isCorrect,
    });
  }

  // Grade Listening Section
  const listeningDetails: QuestionResult[] = [];
  let listeningScore = 0;

  for (let i = 1; i <= 15; i++) {
    const key = `q${i}` as keyof typeof answerKey.listening;
    const userAnswer = answers.listening[key] || "";
    const correctAnswer = answerKey.listening[key];
    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);

    if (isCorrect) listeningScore++;

    listeningDetails.push({
      question: `Q${i}`,
      userAnswer: userAnswer || "(No answer)",
      correctAnswer,
      isCorrect,
    });
  }

  // Grade Writing Section (word count based)
  const writingDetails: QuestionResult[] = [];
  let writingScore = 0;

  for (let i = 1; i <= 5; i++) {
    const key = `q${i}`;
    const userAnswer = answers.writing[key] || "";
    const wordCount = countWords(userAnswer);
    const isCorrect = wordCount >= answerKey.writing.minWordCount;

    if (isCorrect) writingScore++;

    writingDetails.push({
      question: `Q${i}`,
      userAnswer: userAnswer ? `${wordCount} words` : "(No answer)",
      correctAnswer: `≥${answerKey.writing.minWordCount} words`,
      isCorrect,
    });
  }

  const totalScore = readingScore + listeningScore + writingScore;
  const totalQuestions = 35;

  return {
    reading: { score: readingScore, total: 15, details: readingDetails },
    listening: { score: listeningScore, total: 15, details: listeningDetails },
    writing: { score: writingScore, total: 5, details: writingDetails },
    totalScore,
    totalQuestions,
    percentage: Math.round((totalScore / totalQuestions) * 100),
  };
};
