import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPEGVpxl15Akx9VBt-AT9bABvO2s1M3_w",
  authDomain: "ninjamath-b88d2.firebaseapp.com",
  databaseURL: "https://ninjamath-b88d2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ninjamath-b88d2",
  storageBucket: "ninjamath-b88d2.firebasestorage.app",
  messagingSenderId: "276177438351",
  appId: "1:276177438351:web:a4cb3ec4b7caac126d12fa"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
