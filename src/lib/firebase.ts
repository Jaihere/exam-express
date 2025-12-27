
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
    apiKey: "AIzaSyB1yd58g5c3u-n7KxxiK3sCrOPVsGXDEUcY",
    authDomain: "exam-express-6eb4d.firebaseapp.com",
    projectId: "exam-express-6eb4d",
    storageBucket: "exam-express-6eb4d.firebasestorage.app",
    messagingSenderId: "812991914132",
    appId: "1:812991914132:web:2aee13f25c26054a9f5481"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
export const storage = getStorage(app);

// Helper functions for Answer Key & Config
import { doc, getDoc, setDoc } from "firebase/firestore";
import { answerKey as defaultAnswerKey } from "@/config/answerKey";

const KEY_DOC_ID = "config";
const KEY_COLLECTION = "answerKey";

export type ExamConfig = typeof defaultAnswerKey & { pdfUrl?: string };

export const getAnswerKey = async (): Promise<ExamConfig> => {
    try {
        const docRef = doc(db, KEY_COLLECTION, KEY_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as ExamConfig;
        } else {
            console.log("No config found in Firestore, using default.");
            return defaultAnswerKey;
        }
    } catch (e) {
        console.error("Error fetching exam config:", e);
        return defaultAnswerKey;
    }
};

export const saveAnswerKey = async (newKey: ExamConfig) => {
    try {
        await setDoc(doc(db, KEY_COLLECTION, KEY_DOC_ID), newKey, { merge: true });
        return true;
    } catch (e) {
        console.error("Error saving exam config:", e);
        return false;
    }
};

export const uploadExamPdf = async (file: File) => {
    try {
        const storageRef = ref(storage, `exams/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (e) {
        console.error("Error uploading file:", e);
        throw e; // Propagate error for UI feedback
    }
};
