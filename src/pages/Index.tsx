import { useExamStore } from "@/store/examStore";
import { useUserStore } from "@/store/userStore";
import { gradeExam } from "@/lib/gradingEngine";
import { ExamSidebar } from "@/components/ExamSidebar";
import { ReadingSection } from "@/components/ReadingSection";
import { ListeningSection } from "@/components/ListeningSection";
import { WritingSection } from "@/components/WritingSection";
import { ResultsSection } from "@/components/ResultsSection";
import { AdminPanel } from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";
import { Send, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const Index = () => {
  const { currentSection, submitExam, isSubmitted, answers, setSection } = useExamStore();
  const { currentUser, saveResult } = useUserStore();

  const countAnswered = () => {
    const reading = Object.keys(answers.reading).filter((k) => answers.reading[k]).length;
    const listening = Object.keys(answers.listening).filter((k) => answers.listening[k]).length;
    const writing = Object.keys(answers.writing).filter((k) => answers.writing[k]).length;
    return { reading, listening, writing, total: reading + listening + writing };
  };

  const answered = countAnswered();

  const renderSection = () => {
    switch (currentSection) {
      case "reading":
        return <ReadingSection />;
      case "listening":
        return <ListeningSection />;
      case "writing":
        return <WritingSection />;
      case "results":
        return <ResultsSection />;
      case "admin":
        return <AdminPanel />;
      default:
        return <ReadingSection />;
    }
  };

  return (
    <div id="app-wrapper" className="flex h-screen w-full bg-background">
      <ExamSidebar />

      <main id="app-main" className="flex-1 flex flex-col min-w-0">
        {/* Main Content */}
        <div id="app-content-area" className="flex-1 overflow-hidden">
          {renderSection()}
        </div>

        {/* Submit Bar */}
        {!isSubmitted && currentSection !== "results" && (
          <div className="border-t border-border bg-card p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{answered.total}/35</span> questions answered
                <span className="mx-3 text-border">|</span>
                <span>Reading: {answered.reading}/15</span>
                <span className="mx-2">•</span>
                <span>Listening: {answered.listening}/15</span>
                <span className="mx-2">•</span>
                <span>Writing: {answered.writing}/5</span>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="gap-2">
                    <Send className="h-4 w-4" />
                    Submit Exam
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-warning" />
                      Submit Exam?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You have answered {answered.total} out of 35 questions.
                      {answered.total < 35 && (
                        <span className="block mt-2 text-warning">
                          Warning: You have {35 - answered.total} unanswered questions.
                        </span>
                      )}
                      <span className="block mt-2">
                        Once submitted, you cannot change your answers.
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Continue Exam</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                      submitExam();
                      const result = gradeExam(answers, useExamStore.getState().answerKey);

                      if (currentUser && currentUser.username !== "admin") {
                        // Make async
                        (async () => {
                          await saveResult(currentUser.username, {
                            reading: result.reading.score,
                            listening: result.listening.score,
                            writing: result.writing.score,
                            total: result.totalScore,
                            date: new Date().toISOString()
                          }, answers);
                          // Toaster handled in store
                        })();
                      } else {
                        toast.warning("Results not saved (Admin or Guest mode)");
                      }
                    }}>
                      Submit Now
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
