import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// FarmMind AI Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAU5rs9ZqGxHL0NuZ7Ljz_zhJR1aWv8-O4",
  authDomain: "farmmindai.firebaseapp.com",
  projectId: "farmmindai",
  storageBucket: "farmmindai.firebasestorage.app",
  messagingSenderId: "670510412272",
  appId: "1:670510412272:web:a8c77b3ad82713d0a86d35",
  measurementId: "G-WE30ERFVH4"
};

// Initialize Firebase singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Optional Analytics initialization if supported in current browser environment
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics init failure in non-browser or sandbox environments
  });
}
