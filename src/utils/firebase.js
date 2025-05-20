import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsAY-Y_gXkLuvziiXAuAYV1LYN28g2eAw",
  authDomain: "unischedule-43792.firebaseapp.com",
  projectId: "unischedule-43792",
  storageBucket: "unischedule-43792.firebasestorage.app",
  messagingSenderId: "1097755136261",
  appId: "1:1097755136261:web:282b5d3f15b1dfccc5676c",
  measurementId: "G-R14NVE6FRB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
