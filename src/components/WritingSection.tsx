import { useState } from "react";
import { useExamStore } from "@/store/examStore";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PDFUploader } from "@/components/PDFUploader";

export const WritingSection = () => {
  const { answers, setAnswer, answerKey } = useExamStore();
  const writingAnswers = answers.writing;
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (question: string, value: string) => {
    setAnswer("writing", question, value);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <h2 className="section-header mb-0">Writing Section</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Answer the questions briefly and upload your answer sheet PDF.
        </p>
      </div>

      {/* Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Short Answer Questions */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-border bg-background">
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6 max-w-2xl mx-auto w-full">
              {[1, 2, 3, 4, 5].map((id) => {
                const answer = writingAnswers[`q${id}`] || "";

                return (
                  <div
                    key={id}
                    className="question-card"
                    style={{ animationDelay: `${(id - 1) * 100}ms` }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                        Q{id}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Answer
                      </span>
                    </div>

                    <Input
                      value={answer}
                      onChange={(e) => handleChange(`q${id}`, e.target.value)}
                      placeholder="Type your answer here..."
                      className="bg-background"
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Right Side: PDF Upload */}
        <div className="flex-1 flex flex-col min-w-0 bg-muted/10">
          <div className="h-full p-6">
            <div className="h-full bg-background rounded-xl border border-border shadow-sm overflow-hidden">
              <PDFUploader
                onFileSelect={setFile}
                selectedFile={file}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
