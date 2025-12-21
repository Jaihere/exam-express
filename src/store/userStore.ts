import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ExamAnswers } from "@/lib/gradingEngine";
import { toast } from "sonner";

export interface User {
    username: string;
    password?: string;
    results?: {
        reading: number;
        listening: number;
        writing: number;
        total: number;
        date: string;
        answers?: ExamAnswers;
    };
    isCompleted: boolean;
}

interface UserState {
    users: User[];
    currentUser: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (username: string, password?: string) => boolean;
    logout: () => void;
    addUser: (user: User) => void;
    deleteUser: (username: string) => void;
    saveResult: (username: string, result: User["results"], answers: ExamAnswers) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            users: [],
            currentUser: null,
            isAuthenticated: false,
            isAdmin: false,

            login: (username, password) => {
                // Admin Login
                if (username === "admin" && password === "K1AFTpSGQGYyiinh") {
                    set({
                        currentUser: { username: "admin", isCompleted: false },
                        isAuthenticated: true,
                        isAdmin: true,
                    });
                    return true;
                }

                // User Login
                const user = get().users.find((u) => u.username === username);
                if (user) {
                    if (user.password && user.password !== password) {
                        toast.error("Invalid password for this user");
                        return false;
                    }
                    set({
                        currentUser: user,
                        isAuthenticated: true,
                        isAdmin: false,
                    });
                    return true;
                }

                toast.error("User not found");
                return false;
            },

            logout: () => {
                set({ currentUser: null, isAuthenticated: false, isAdmin: false });
            },

            addUser: (newUser) => {
                const users = get().users;
                if (users.some((u) => u.username === newUser.username)) {
                    toast.error("User already exists");
                    return;
                }
                set({ users: [...users, newUser] });
                toast.success(`User ${newUser.username} added`);
            },

            deleteUser: (username) => {
                set((state) => ({
                    users: state.users.filter((u) => u.username !== username),
                }));
                toast.success("User deleted");
            },

            saveResult: (username, result, answers) => {
                const resultWithAnswers = { ...result, answers };
                set((state) => ({
                    users: state.users.map((u) =>
                        u.username === username
                            ? { ...u, results: resultWithAnswers, isCompleted: true }
                            : u
                    ),
                    // Also update current user if it's them
                    currentUser:
                        state.currentUser?.username === username
                            ? { ...state.currentUser, results: resultWithAnswers, isCompleted: true }
                            : state.currentUser,
                }));
            },
        }),
        {
            name: "exam-user-storage",
        }
    )
);
