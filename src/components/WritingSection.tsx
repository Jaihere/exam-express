import { useExamStore } from "@/store/examStore";
import { writingPrompts } from "@/config/examContent";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { answerKey } from "@/config/answerKey";

export const WritingSection = () => {
  const { answers, setAnswer } = useExamStore();
  const writingAnswers = answers.writing;

  const handleChange = (question: string, value: string) => {
    setAnswer("writing", question, value);
  };

  const countWords = (text: string): number => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <h2 className="section-header mb-0">Writing Section</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Write at least {answerKey.writing.minWordCount} words for each question to earn a point
        </p>
      </div>

      {/* Questions */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          {writingPrompts.map((prompt, index) => {
            const answer = writingAnswers[`q${prompt.id}`] || "";
            const wordCount = countWords(answer);
            const isMinimumMet = wordCount >= answerKey.writing.minWordCount;

            return (
              <div
                key={prompt.id}
                className="question-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                        Q{prompt.id}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          isMinimumMet
                            ? "bg-success/20 text-success"
                            : wordCount > 0
                            ? "bg-warning/20 text-warning"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {wordCount} / {answerKey.writing.minWordCount} words
                      </span>
                    </div>
                    <Label className="font-semibold text-foreground text-base">
                      {prompt.prompt}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {prompt.instructions}
                    </p>
                  </div>
                </div>

                <Textarea
                  value={answer}
                  onChange={(e) => handleChange(`q${prompt.id}`, e.target.value)}
                  placeholder="Write your response here..."
                  className="min-h-[150px] bg-background resize-y"
                />
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
