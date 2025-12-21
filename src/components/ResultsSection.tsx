import { useExamStore } from "@/store/examStore";
import { useUserStore } from "@/store/userStore";
import { gradeExam, GradingResult } from "@/lib/gradingEngine";
import { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trophy, RotateCcw, BookOpen, Headphones, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

export const ResultsSection = () => {
  const { answers, resetExam, answerKey } = useExamStore();
  const { isAdmin } = useUserStore();

  const results: GradingResult = useMemo(() => gradeExam(answers, answerKey), [answers, answerKey]);

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-primary";
    if (percentage >= 40) return "text-warning";
    return "text-destructive";
  };

  const getGradeBg = (percentage: number) => {
    if (percentage >= 80) return "from-success/20 to-success/5";
    if (percentage >= 60) return "from-primary/20 to-primary/5";
    if (percentage >= 40) return "from-warning/20 to-warning/5";
    return "from-destructive/20 to-destructive/5";
  };

  const sectionIcons = {
    reading: BookOpen,
    listening: Headphones,
    writing: PenTool,
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col h-full animate-fade-in items-center justify-center p-6 text-center">
        <div className="bg-primary/10 p-6 rounded-full mb-6 animate-scale-in">
          <CheckCircle className="h-16 w-16 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Exam Completed!</h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
          Thank you for completing the exam. Your answers have been submitted successfully.
          Please contact the administrator for your results.
        </p>
        <Button onClick={resetExam} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Return to Start
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="section-header mb-0 flex items-center gap-2">
              <Trophy className="h-7 w-7 text-primary" />
              Exam Results
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Your performance breakdown</p>
          </div>
          <Button onClick={resetExam} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Retake Exam
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 max-w-4xl mx-auto space-y-8">
          {/* Total Score Card */}
          <div
            className={cn(
              "rounded-2xl p-8 text-center bg-gradient-to-b animate-scale-in",
              getGradeBg(results.percentage)
            )}
          >
            <div className="mb-4">
              <span className={cn("text-7xl font-bold", getGradeColor(results.percentage))}>
                {results.percentage}%
              </span>
            </div>
            <p className="text-lg text-muted-foreground">
              Total Score: {results.totalScore} / {results.totalQuestions}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {results.percentage >= 80
                ? "Excellent! Outstanding performance!"
                : results.percentage >= 60
                  ? "Good job! You passed the exam."
                  : results.percentage >= 40
                    ? "You can do better. Keep practicing!"
                    : "Needs improvement. Review the material."}
            </p>
          </div>

          {/* Section Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["reading", "listening", "writing"] as const).map((section, index) => {
              const sectionData = results[section];
              const percentage = Math.round((sectionData.score / sectionData.total) * 100);
              const Icon = sectionIcons[section];

              return (
                <div
                  key={section}
                  className="question-card text-center animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold capitalize text-foreground">{section}</h3>
                  <div className={cn("text-3xl font-bold my-2", getGradeColor(percentage))}>
                    {sectionData.score}/{sectionData.total}
                  </div>
                  <p className="text-sm text-muted-foreground">{percentage}%</p>
                </div>
              );
            })}
          </div>

          {/* Detailed Results */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {(["reading", "listening", "writing"] as const).map((section) => {
              const sectionData = results[section];
              const Icon = sectionIcons[section];

              return (
                <div key={section} className="space-y-3">
                  <h3 className="font-semibold text-lg capitalize flex items-center gap-2 text-foreground">
                    <Icon className="h-5 w-5 text-primary" />
                    {section} Details
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {sectionData.details.map((detail, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-lg border flex items-start gap-3 transition-all",
                          detail.isCorrect ? "result-correct" : "result-incorrect"
                        )}
                      >
                        {detail.isCorrect ? (
                          <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{detail.question}</p>
                          <p className="text-xs truncate">Your: {detail.userAnswer}</p>
                          {!detail.isCorrect && (
                            <p className="text-xs truncate font-medium">
                              Correct: {detail.correctAnswer}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
