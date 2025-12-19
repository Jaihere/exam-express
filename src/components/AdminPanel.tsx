import { useState } from "react";
import { useExamStore } from "@/store/examStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, RefreshCw, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminPanel = () => {
    const { answerKey, updateAnswerKey } = useExamStore();
    const [localKey, setLocalKey] = useState(answerKey);
    const [isDirty, setIsDirty] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "K1AFTpSGQGYyiinh") {
            setIsAuthenticated(true);
        } else {
            alert("Incorrect password");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-full bg-muted/20">
                <Card className="w-full max-w-md mx-4 animate-scale-in">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Admin Access</CardTitle>
                        <CardDescription>Enter password to manage answer key</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <Input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button type="submit" className="w-full">
                                Access Panel
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleUpdate = (
        section: "reading" | "listening" | "writing",
        key: string,
        value: string
    ) => {
        setLocalKey((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
        setIsDirty(true);
    };

    const handleSave = () => {
        updateAnswerKey(localKey);
        setIsDirty(false);
        // toast({ title: "Answer Key Updated", description: "Changes have been saved successfully." });
        alert("Answer Key Updated Successfully!");
    };

    const handleReset = () => {
        setLocalKey(answerKey);
        setIsDirty(false);
    };

    return (
        <div className="flex flex-col h-full animate-fade-in">
            {/* Header */}
            <div className="p-6 border-b border-border bg-card flex items-center justify-between">
                <div>
                    <h2 className="section-header mb-0">Admin Panel</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Update the answer key for grading.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleReset} disabled={!isDirty}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                    <Button onClick={handleSave} disabled={!isDirty}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-6 max-w-4xl mx-auto">
                    <Tabs defaultValue="reading" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                            <TabsTrigger value="reading">Reading</TabsTrigger>
                            <TabsTrigger value="listening">Listening</TabsTrigger>
                            <TabsTrigger value="writing">Writing</TabsTrigger>
                        </TabsList>

                        <TabsContent value="reading" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(localKey.reading).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize">
                                            {key.replace("q", "Question ")}
                                        </label>
                                        <Input
                                            value={value}
                                            onChange={(e) => handleUpdate("reading", key, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="listening" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(localKey.listening).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize">
                                            {key.replace("q", "Question ")}
                                        </label>
                                        <Input
                                            value={value}
                                            onChange={(e) => handleUpdate("listening", key, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="writing" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(localKey.writing).map(([key, value]) => {
                                    if (typeof value !== "string") return null; // Skip non-string props like minWordCount if any remained
                                    return (
                                        <div key={key} className="space-y-2">
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize">
                                                {key.replace("q", "Question ")}
                                            </label>
                                            <Input
                                                value={value}
                                                onChange={(e) => handleUpdate("writing", key, e.target.value)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </ScrollArea>
        </div>
    );
};
