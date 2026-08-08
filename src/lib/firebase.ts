import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDH8PbhX6V_hEl360AHBwSTOWe5lYYhTeo",
  authDomain: "doctorscare-3bbcf.firebaseapp.com",
  projectId: "doctorscare-3bbcf",
  storageBucket: "doctorscare-3bbcf.firebasestorage.app",
  messagingSenderId: "751128838280",
  appId: "1:751128838280:web:c3ddcbf307aa272a959f3d",
  measurementId: "G-B10LN1STFK"
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics conditionally (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes ? analytics = getAnalytics(app) : null);
}

export { app, analytics };
