
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
export const db = getFirestore(app);
