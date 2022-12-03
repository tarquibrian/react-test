import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBU20Ar2j_E41rM7qJnVT_hd4WKP1b3Gro",
  authDomain: "test-2053f.firebaseapp.com",
  projectId: "test-2053f",
  storageBucket: "test-2053f.appspot.com",
  messagingSenderId: "691413546687",
  appId: "1:691413546687:web:81d4234b775b38f421780a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
