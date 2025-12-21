import { create } from "zustand";
import { ExamAnswers } from "@/lib/gradingEngine";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";

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
    isLoading: boolean;
    fetchUsers: () => Promise<void>;
    login: (username: string, password?: string) => Promise<boolean>;
    logout: () => void;
    addUser: (user: User) => Promise<void>;
    deleteUser: (username: string) => Promise<void>;
    saveResult: (username: string, result: User["results"], answers: ExamAnswers) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    currentUser: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: false,

    fetchUsers: async () => {
        set({ isLoading: true });
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const users: User[] = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data() as User);
            });
            set({ users });
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (username, password) => {
        // Ensure users are loaded (or we could query directly, but let's stick to the plan: load all)
        if (get().users.length === 0) {
            await get().fetchUsers();
        }

        // Admin Login (Hardcoded for now as per original, but could be in DB too)
        if (username === "admin" && password === "K1AFTpSGQGYyiinh") {
            set({
                currentUser: { username: "admin", isCompleted: false },
                isAuthenticated: true,
                isAdmin: true,
            });
            return true;
        }

        // User Login
        const users = get().users;
        const user = users.find((u) => u.username === username);

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

    addUser: async (newUser) => {
        set({ isLoading: true });
        try {
            const users = get().users;
            if (users.some((u) => u.username === newUser.username)) {
                toast.error("User already exists");
                return;
            }

            // Add to Firestore using username as ID
            await setDoc(doc(db, "users", newUser.username), newUser);

            // Update local state
            set({ users: [...users, newUser] });
            toast.success(`User ${newUser.username} added`);
        } catch (error) {
            console.error("Error adding user:", error);
            toast.error("Failed to add user");
        } finally {
            set({ isLoading: false });
        }
    },

    deleteUser: async (username) => {
        set({ isLoading: true });
        try {
            await deleteDoc(doc(db, "users", username));

            set((state) => ({
                users: state.users.filter((u) => u.username !== username),
            }));
            toast.success("User deleted");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user");
        } finally {
            set({ isLoading: false });
        }
    },

    saveResult: async (username, result, answers) => {
        set({ isLoading: true });
        try {
            const resultWithAnswers = { ...result, answers };

            // Update Firestore
            // We need to fetch the existing user to keep password/etc or just update fields
            // Since we store strict objects, updateDoc is partial.
            await updateDoc(doc(db, "users", username), {
                results: resultWithAnswers,
                isCompleted: true
            });

            // Update local state
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
            toast.success("Results saved successfully");
        } catch (error) {
            console.error("Error saving result:", error);
            toast.error("Failed to save result");
        } finally {
            set({ isLoading: false });
        }
    },
}));
