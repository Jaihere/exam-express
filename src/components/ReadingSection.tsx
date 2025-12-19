import { readingPassage } from "@/config/examContent";
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

export const ReadingSection = () => {
  const { answers, setAnswer } = useExamStore();
  const readingAnswers = answers.reading;

  const handleChange = (question: string, value: string) => {
    setAnswer("reading", question, value);
  };

  return (
    <div className="flex h-full animate-fade-in">
      {/* Left Panel - Reading Passage */}
      <div className="w-1/2 border-r border-border">
        <div className="p-6 border-b border-border bg-card">
          <h2 className="section-header mb-0">Reading Passage</h2>
          <p className="text-sm text-muted-foreground mt-1">Read carefully before answering questions</p>
        </div>
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-6">
            <article className="passage-text prose prose-slate max-w-none">
              {readingPassage.split("\n\n").map((paragraph, idx) => {
                const trimmed = paragraph.trim();
                if (trimmed.startsWith("# ")) {
                  return (
                    <h1 key={idx} className="text-2xl font-bold mb-4 text-foreground font-heading">
                      {trimmed.substring(2)}
                    </h1>
                  );
                }
                if (trimmed.startsWith("## ")) {
                  return (
                    <h2 key={idx} className="text-xl font-semibold mt-6 mb-3 text-foreground font-heading">
                      {trimmed.substring(3)}
                    </h2>
                  );
                }
                if (!trimmed) return null;
                return (
                  <p key={idx} className="mb-4 text-foreground/90 leading-7">
                    {trimmed}
                  </p>
                );
              })}
            </article>
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Questions */}
      <div className="w-1/2 bg-background">
        <div className="p-6 border-b border-border bg-card">
          <h2 className="section-header mb-0">Questions (1-15)</h2>
          <p className="text-sm text-muted-foreground mt-1">Answer all questions based on the passage</p>
        </div>
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-6 space-y-8">
            {/* Multiple Choice Questions 1-5 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                  Q1-5
                </span>
                <h3 className="font-semibold text-foreground">Multiple Choice</h3>
              </div>
              <p className="text-sm text-muted-foreground">Choose the best answer (A, B, C, or D)</p>
              
              {[1, 2, 3, 4, 5].map((q) => (
                <div key={q} className="question-card">
                  <Label className="font-medium text-foreground">Question {q}</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    {q === 1 && "What percentage of the world's population lives in cities currently?"}
                    {q === 2 && "According to the passage, cities produce what percentage of global carbon emissions?"}
                    {q === 3 && "Which city is mentioned as using sensors for data analytics?"}
                    {q === 4 && "What is described as the greatest opportunity for sustainable transformation?"}
                    {q === 5 && "What is essential for urban sustainability according to the passage?"}
                  </p>
                  <RadioGroup
                    value={readingAnswers[`q${q}`] || ""}
                    onValueChange={(value) => handleChange(`q${q}`, value)}
                    className="grid grid-cols-2 gap-2"
                  >
                    {["A", "B", "C", "D"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`q${q}-${option}`} />
                        <Label htmlFor={`q${q}-${option}`} className="cursor-pointer text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>

            {/* True/False/Not Given Questions 6-10 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                  Q6-10
                </span>
                <h3 className="font-semibold text-foreground">True / False / Not Given</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Determine if the statement is TRUE, FALSE, or NOT GIVEN based on the passage
              </p>
              
              {[6, 7, 8, 9, 10].map((q) => (
                <div key={q} className="question-card">
                  <Label className="font-medium text-foreground">Question {q}</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    {q === 6 && "By 2050, nearly 70% of humanity will live in urban centers."}
                    {q === 7 && "Traditional urban planning approaches are adequate for modern challenges."}
                    {q === 8 && "Barcelona's smart city initiative was launched in 2015."}
                    {q === 9 && "Community engagement is important for urban sustainability."}
                    {q === 10 && "Technology alone can create sustainable cities."}
                  </p>
                  <Select
                    value={readingAnswers[`q${q}`] || ""}
                    onValueChange={(value) => handleChange(`q${q}`, value)}
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select answer" />
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

            {/* Matching Questions 11-15 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                  Q11-15
                </span>
                <h3 className="font-semibold text-foreground">Matching</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Match each statement with the correct letter (A-E)
              </p>
              <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-1">
                <p><strong>A.</strong> Singapore</p>
                <p><strong>B.</strong> Barcelona</p>
                <p><strong>C.</strong> Circular economy</p>
                <p><strong>D.</strong> Community engagement</p>
                <p><strong>E.</strong> Urban areas</p>
              </div>
              
              {[11, 12, 13, 14, 15].map((q) => (
                <div key={q} className="question-card">
                  <Label className="font-medium text-foreground">Question {q}</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    {q === 11 && "Consume over two-thirds of the world's energy"}
                    {q === 12 && "Has a Smart Nation initiative"}
                    {q === 13 && "Contributes to more livable cities along with green spaces"}
                    {q === 14 && "Uses sensors to monitor air quality and noise"}
                    {q === 15 && "Essential component of urban sustainability"}
                  </p>
                  <Input
                    value={readingAnswers[`q${q}`] || ""}
                    onChange={(e) => handleChange(`q${q}`, e.target.value.toUpperCase())}
                    placeholder="Enter letter (A-E)"
                    maxLength={1}
                    className="w-24 uppercase bg-background"
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
