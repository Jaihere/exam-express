// Answer Key Configuration - Easy to update
export const answerKey = {
  reading: {
    // Q1-5: Multiple Choice (A, B, C, D)
    q1: "B",
    q2: "A",
    q3: "B",
    q4: "A",
    q5: "A",
    // Q6-10: True/False/Not Given
    q6: "FALSE",
    q7: "FALSE",
    q8: "TRUE",
    q9: "FALSE",
    q10: "TRUE",
    // Q11-15: Matching (Letters A-Z)
    q11: "X",
    q12: "H",
    q13: "B",
    q14: "E",
    q15: "D",
  },
  listening: {
    // Q1-5: Short Text Input
    q1: "Donnerstag",
    q2: "0611245498",
    q3: "Vater und Mutter besuchen",
    q4: "Salat",
    q5: "20.14",
    // Q6-10: Multiple Choice
    q6: "A",
    q7: "C",
    q8: "B",
    q9: "C",
    q10: "B",
    // Q11-15: Matching (A-Z)
    q11: "A",
    q12: "G",
    q13: "H",
    q14: "C",
    q15: "E",
  },
  writing: {
    // Model answers for reference (optional comparison)
    q1: "80130, München",
    q2: "m.bialik@in.eu",
    q3: "Polnisch",
    q4: "Ja",
    q5: "Spazieren, Musik",
  },
};

export type ReadingAnswers = typeof answerKey.reading;
export type ListeningAnswers = typeof answerKey.listening;
export type WritingAnswers = typeof answerKey.writing;
