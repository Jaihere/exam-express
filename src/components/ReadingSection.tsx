import { useState } from "react";
import { useExamStore } from "@/store/examStore";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PDFUploader } from "@/components/PDFUploader";

export const ReadingSection = () => {
  const { answers, setAnswer } = useExamStore();
  const readingAnswers = answers.reading;
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleChange = (question: string, value: string) => {
    setAnswer("reading", question, value);
  };

  return (
    <div className="flex h-full animate-fade-in">
      {/* Left Panel - PDF Upload */}
      <div className="w-1/2 border-r border-border bg-muted/20">
        <PDFUploader onFileSelect={setPdfFile} selectedFile={pdfFile} />
      </div>

      {/* Right Panel - Answer Fields Only */}
      <div className="w-1/2 bg-background">
        <div className="p-6 border-b border-border bg-card">
          <h2 className="section-header mb-0">Answer Sheet</h2>
          <p className="text-sm text-muted-foreground mt-1">Enter your answers below</p>
        </div>
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-6 space-y-6">
            {/* Multiple Choice Questions 1-5 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                  Q1-5
                </span>
                <h3 className="font-semibold text-foreground">Multiple Choice (A, B, C, D)</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {[1, 2, 3, 4, 5].map((q) => (
                  <div key={q} className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border">
                    <span className="font-medium text-foreground w-8">Q{q}</span>
                    <RadioGroup
                      value={readingAnswers[`q${q}`] || ""}
                      onValueChange={(value) => handleChange(`q${q}`, value)}
                      className="flex gap-4"
                    >
                      {["A", "B", "C", "D"].map((option) => (
                        <div key={option} className="flex items-center space-x-1">
                          <RadioGroupItem value={option} id={`q${q}-${option}`} />
                          <Label htmlFor={`q${q}-${option}`} className="cursor-pointer text-sm font-medium">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </div>

            {/* True/False/Not Given Questions 6-10 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                  Q6-10
                </span>
                <h3 className="font-semibold text-foreground">True / False / Not Given</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {[6, 7, 8, 9, 10].map((q) => (
                  <div key={q} className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border">
                    <span className="font-medium text-foreground w-8">Q{q}</span>
                    <Select
                      value={readingAnswers[`q${q}`] || ""}
                      onValueChange={(value) => handleChange(`q${q}`, value)}
                    >
                      <SelectTrigger className="w-40 bg-background">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="TRUE">TRUE</SelectItem>
                        <SelectItem value="FALSE">FALSE</SelectItem>
                        <SelectItem value="NOT GIVEN">NOT GIVEN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {/* Matching Questions 11-15 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                  Q11-15
                </span>
                <h3 className="font-semibold text-foreground">Matching (A-Z)</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {[11, 12, 13, 14, 15].map((q) => (
                  <div key={q} className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border">
                    <span className="font-medium text-foreground w-8">Q{q}</span>
                    <Input
                      value={readingAnswers[`q${q}`] || ""}
                      onChange={(e) => handleChange(`q${q}`, e.target.value.toUpperCase())}
                      placeholder="A-Z"
                      maxLength={1}
                      className="w-20 uppercase bg-background text-center font-medium"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
