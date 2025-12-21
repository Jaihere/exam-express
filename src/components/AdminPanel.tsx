import { useState, useEffect } from "react";
import { useExamStore } from "@/store/examStore";
import { useUserStore } from "@/store/userStore";
import { AdminResultView } from "./AdminResultView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, RefreshCw, Trash, UserPlus, FileSpreadsheet } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const AdminPanel = () => {
    const { answerKey, updateAnswerKey } = useExamStore();
    const { users, addUser, deleteUser, logout, fetchUsers, isLoading } = useUserStore();
    const [localKey, setLocalKey] = useState(answerKey);
    const [isDirty, setIsDirty] = useState(false);

    // New User Form State
    const [newUserUser, setNewUserUser] = useState("");
    const [newUserPass, setNewUserPass] = useState("");
    const [selectedUserForDetails, setSelectedUserForDetails] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

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
        toast.success("Answer Key Updated Successfully!");
    };

    const handleReset = () => {
        setLocalKey(answerKey);
        setIsDirty(false);
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUserUser || !newUserPass) return;
        await addUser({
            username: newUserUser,
            password: newUserPass,
            isCompleted: false
        });
        setNewUserUser("");
        setNewUserPass("");
    };

    const selectedUserObj = users.find(u => u.username === selectedUserForDetails);

    if (selectedUserForDetails && selectedUserObj) {
        return <AdminResultView user={selectedUserObj} onBack={() => setSelectedUserForDetails(null)} />;
    }

    return (
        <div className="flex flex-col h-full animate-fade-in">
            {/* ... Header ... */}
            <div className="p-6 border-b border-border bg-card flex items-center justify-between">
                {/* ... same header ... */}
                <div>
                    <h2 className="section-header mb-0">Admin Panel</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage users, results, and answer keys.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-6 max-w-5xl mx-auto">
                    {/* ... Tabs ... */}
                    <Tabs defaultValue="users" className="w-full">
                        {/* ... TabList ... */}
                        <TabsList className="grid w-full grid-cols-3 mb-8">
                            <TabsTrigger value="users">User Management</TabsTrigger>
                            <TabsTrigger value="results">Exam Results</TabsTrigger>
                            <TabsTrigger value="keys">Answer Key</TabsTrigger>
                        </TabsList>

                        {/* ... Users Tab ... */}
                        <TabsContent value="users" className="space-y-6">
                            {/* ... (keep user management content same, I will use a larger block to ensure context matches) ... */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <UserPlus className="h-5 w-5" />
                                        Create New User
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleAddUser} className="flex gap-4 items-end">
                                        <div className="grid w-full gap-2">
                                            <label>Username</label>
                                            <Input
                                                placeholder="e.g., student01"
                                                value={newUserUser}
                                                onChange={(e) => setNewUserUser(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid w-full gap-2">
                                            <label>Password</label>
                                            <Input
                                                placeholder="e.g., pass123"
                                                value={newUserPass}
                                                onChange={(e) => setNewUserPass(e.target.value)}
                                            />
                                        </div>
                                        <Button type="submit">Generate</Button>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Existing Users</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Username</TableHead>
                                                <TableHead>Password</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                                        No users created yet.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {users.map((user) => (
                                                <TableRow key={user.username}>
                                                    <TableCell className="font-medium">{user.username}</TableCell>
                                                    <TableCell className="font-mono text-muted-foreground">{user.password}</TableCell>
                                                    <TableCell>
                                                        {user.isCompleted ? (
                                                            <span className="text-green-600 font-medium">Completed</span>
                                                        ) : (
                                                            <span className="text-yellow-600">Pending</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive hover:text-destructive/90"
                                                            onClick={() => deleteUser(user.username)}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* RESULTS TAB */}
                        <TabsContent value="results" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileSpreadsheet className="h-5 w-5" />
                                        Student Results
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Student</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Reading</TableHead>
                                                <TableHead>Listening</TableHead>
                                                <TableHead>Writing</TableHead>
                                                <TableHead className="text-right">Total Score</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.filter(u => u.isCompleted && u.results).length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                                        No results available.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {users
                                                .filter(u => u.isCompleted && u.results)
                                                .map((user) => (
                                                    <TableRow key={user.username}>
                                                        <TableCell className="font-medium">{user.username}</TableCell>
                                                        <TableCell>{user.results?.date ? new Date(user.results.date).toLocaleDateString() : "-"}</TableCell>
                                                        <TableCell>{user.results?.reading}/15</TableCell>
                                                        <TableCell>{user.results?.listening}/15</TableCell>
                                                        <TableCell>{user.results?.writing}/5</TableCell>
                                                        <TableCell className="text-right font-bold text-primary">
                                                            {user.results?.total}/35
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button size="sm" variant="outline" onClick={() => setSelectedUserForDetails(user.username)}>
                                                                View Details
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* KEYS TAB */}
                        <TabsContent value="keys" className="space-y-4">
                            <div className="flex justify-end gap-2 mb-4">
                                <Button variant="outline" onClick={handleReset} disabled={!isDirty}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Reset
                                </Button>
                                <Button onClick={handleSave} disabled={!isDirty}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </Button>
                            </div>

                            <Tabs defaultValue="reading" className="w-full">
                                <TabsList className="w-full grid grid-cols-3">
                                    <TabsTrigger value="reading">Reading Key</TabsTrigger>
                                    <TabsTrigger value="listening">Listening Key</TabsTrigger>
                                    <TabsTrigger value="writing">Writing Key</TabsTrigger>
                                </TabsList>
                                <TabsContent value="reading" className="mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(localKey.reading).map(([key, value]) => (
                                            <div key={key} className="space-y-2">
                                                <label className="text-sm font-medium capitalize">
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
                                <TabsContent value="listening" className="mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(localKey.listening).map(([key, value]) => (
                                            <div key={key} className="space-y-2">
                                                <label className="text-sm font-medium capitalize">
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
                                <TabsContent value="writing" className="mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(localKey.writing).map(([key, value]) => {
                                            if (typeof value !== "string") return null;
                                            return (
                                                <div key={key} className="space-y-2">
                                                    <label className="text-sm font-medium capitalize">
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
                        </TabsContent>
                    </Tabs>
                </div>
            </ScrollArea>
        </div>
    );
};
