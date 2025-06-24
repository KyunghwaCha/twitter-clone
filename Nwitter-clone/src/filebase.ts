// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCD91tu5ScKZIOX8ZBFvUyk_hopEyBnhOI",
  authDomain: "nwitter-reloaded-ae894.firebaseapp.com",
  projectId: "nwitter-reloaded-ae894",
  storageBucket: "nwitter-reloaded-ae894.firebasestorage.app",
  messagingSenderId: "853664234178",
  appId: "1:853664234178:web:2fb7b89ca5577600fad95b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
