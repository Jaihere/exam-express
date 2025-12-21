import { User } from "@/store/userStore";
import { useExamStore } from "@/store/examStore";
import { gradeExam, GradingResult } from "@/lib/gradingEngine";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle, Printer, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminResultViewProps {
    user: User;
    onBack: () => void;
}

export const AdminResultView = ({ user, onBack }: AdminResultViewProps) => {
    const { answerKey } = useExamStore();

    // Calculate results on the fly using the stored answers
    // If no answers stored (legacy data), we can't show details, just total score.
    const results: GradingResult | null = useMemo(() => {
        if (!user.results?.answers) return null;
        return gradeExam(user.results.answers, answerKey);
    }, [user, answerKey]);

    const handlePrint = () => {
        window.print();
    };

    if (!results) {
        return (
            <div className="p-6 text-center">
                <p className="text-muted-foreground mb-4">Detailed answer data is not available for this user (Legacy Record).</p>
                <Button onClick={onBack}>Go Back</Button>
            </div>
        );
    }

    return (
        <>
            {/* SCREEN VIEW */}
            <div className="bg-background h-full flex flex-col p-6 animate-fade-in print-container print:hidden">
                {/* Header - Fixed at top */}
                <div className="flex-none max-w-4xl mx-auto w-full mb-8">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" onClick={onBack} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to List
                        </Button>
                        <Button onClick={handlePrint} className="gap-2">
                            <Printer className="h-4 w-4" />
                            Print Result / Save PDF
                        </Button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <ScrollArea className="flex-1 w-full max-w-4xl mx-auto border rounded-md p-4 bg-card shadow-sm">
                    <div className="space-y-8 p-4">
                        <div className="text-center border-b pb-6">
                            <h1 className="text-3xl font-bold mb-2">Exam Result Report</h1>
                            <div className="flex justify-center gap-8 text-lg">
                                <p><strong>Student:</strong> {user.username}</p>
                                <p><strong>Date:</strong> {new Date(user.results?.date || "").toLocaleDateString()}</p>
                                <p><strong>Total Score:</strong> {results.totalScore} / {results.totalQuestions} ({results.percentage}%)</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                            {/* Map over sections (Logic Reused) */}
                            {(["reading", "listening", "writing"] as const).map((section) => {
                                const sectionData = results[section];
                                if (!sectionData) return null;
                                return (
                                    <div key={section} className="space-y-3">
                                        <h2 className="text-xl font-bold mb-4 capitalize border-l-4 border-primary pl-3 bg-muted/20 py-2">
                                            {section} Section <span className="ml-4 text-sm font-normal text-muted-foreground">({sectionData.score}/{sectionData.total})</span>
                                        </h2>
                                        <div className="grid grid-cols-1 gap-2">
                                            {sectionData.details.map((detail, idx) => (
                                                <div key={idx} className={cn("flex items-start gap-4 p-3 rounded border text-sm", detail.isCorrect ? "bg-green-50/50 border-green-100" : "bg-red-50/50 border-red-100")}>
                                                    <div className="mt-0.5">{detail.isCorrect ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}</div>
                                                    <div className="flex-1 grid grid-cols-1 gap-1">
                                                        <span className="font-semibold">{detail.question}</span>
                                                        <span className={cn(!detail.isCorrect && "line-through text-muted-foreground")}>Answer: {detail.userAnswer}</span>
                                                        {!detail.isCorrect && <span className="font-semibold text-green-700">Correct: {detail.correctAnswer}</span>}
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

            {/* PRINT VIEW (Isolated & Compact) */}
            <div className="hidden print:block p-0 m-0 w-full h-auto text-[10px] leading-tight">
                <div className="border-b border-black pb-1 mb-2">
                    <div className="flex items-center justify-between">
                        <h1 className="text-sm font-bold uppercase tracking-wider">Exam Results</h1>
                        <div className="flex gap-4">
                            <span><strong>Student:</strong> {user.username}</span>
                            <span><strong>Date:</strong> {new Date(user.results?.date || "").toLocaleDateString()}</span>
                            <span><strong>Score:</strong> {results.totalScore}/{results.totalQuestions} ({results.percentage}%)</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 items-start">
                    {(["reading", "listening", "writing"] as const).map((section) => {
                        const sectionData = results[section];
                        if (!sectionData) return null;
                        return (
                            <div key={section} className="break-inside-avoid">
                                <h2 className="font-bold mb-1 uppercase text-[11px] border-b border-gray-300 pb-0.5">
                                    {section} ({sectionData.score}/{sectionData.total})
                                </h2>
                                <div className="space-y-0.5">
                                    {sectionData.details.map((detail, idx) => (
                                        <div key={idx} className="border-b border-gray-100 py-0.5">
                                            <div className="flex items-start gap-1.5">
                                                <div className="mt-0.5 shrink-0">
                                                    {detail.isCorrect ? <span className="text-green-600 font-bold">✓</span> : <span className="text-red-600 font-bold">✗</span>}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-semibold truncate">{detail.question}</div>
                                                    <div className="flex flex-wrap gap-x-2 text-[9px] text-gray-600">
                                                        <span className={cn(!detail.isCorrect && "line-through opacity-70")}>Ans: {detail.userAnswer}</span>
                                                        {!detail.isCorrect && <span className="font-bold text-black bg-gray-100 px-1 rounded-sm">Correct: {detail.correctAnswer}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                @media print {
                    @page { margin: 0.5cm; size: auto; }
                    html, body { margin: 0 !important; padding: 0 !important; height: auto !important; overflow: visible !important; background: white !important; }
                    
                    /* Hide Sidebar and other non-print elements globally if possible */
                    #app-sidebar { display: none !important; }
                    
                    /* Reset global layout containers to allow content to flow */
                    #app-wrapper, #app-main, #app-content-area { 
                        display: block !important; 
                        height: auto !important; 
                        overflow: visible !important; 
                        position: static !important; 
                    }

                    /* Explicitly show our print view */
                    .print\\:block { display: block !important; }
                }
            `}</style>
        </>
    );
};
