// Answer Key Configuration - Easy to update
export const answerKey = {
  reading: {
    // Q1-5: Multiple Choice (A, B, C, D)
    q1: "B",
    q2: "C",
    q3: "A",
    q4: "D",
    q5: "B",
    // Q6-10: True/False/Not Given
    q6: "TRUE",
    q7: "FALSE",
    q8: "NOT GIVEN",
    q9: "TRUE",
    q10: "FALSE",
    // Q11-15: Matching (Letters A-Z)
    q11: "E",
    q12: "A",
    q13: "C",
    q14: "B",
    q15: "D",
  },
  listening: {
    // Q1-5: Short Text Input
    q1: "morning",
    q2: "library",
    q3: "wednesday",
    q4: "fifteen",
    q5: "green",
    // Q6-10: Multiple Choice
    q6: "A",
    q7: "C",
    q8: "B",
    q9: "D",
    q10: "A",
    // Q11-15: Matching (A-Z)
    q11: "C",
    q12: "A",
    q13: "E",
    q14: "B",
    q15: "D",
  },
  writing: {
    // Model answers for reference (optional comparison)
    q1: "Jay",
    q2: "Jay",
    q3: "Jay",
    q4: "Jay",
    q5: "Jay",
  },
};

export type ReadingAnswers = typeof answerKey.reading;
export type ListeningAnswers = typeof answerKey.listening;
export type WritingAnswers = typeof answerKey.writing;
