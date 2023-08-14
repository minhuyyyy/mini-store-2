import { initializeApp } from "firebase/app";
import { getStorage } from "@firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD5CUM3ol047VxOFNzRjtYknWZ9DEmqXtI",
  authDomain: "lunar-parsec-392805.firebaseapp.com",
  projectId: "lunar-parsec-392805",
  storageBucket: "lunar-parsec-392805.appspot.com",
  messagingSenderId: "913421392005",
  appId: "1:913421392005:web:4e868b0a29000f0e6f71ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);