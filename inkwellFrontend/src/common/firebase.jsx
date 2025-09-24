import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { toast } from "react-hot-toast";

const firebaseConfig = {
  apiKey: "AIzaSyBgwPUysbcclQ1qqRRenNBdNw14LM1gunM",
  authDomain: "inkwell-5ae8a.firebaseapp.com",
  projectId: "inkwell-5ae8a",
  storageBucket: "inkwell-5ae8a.firebasestorage.app",
  messagingSenderId: "701258067469",
  appId: "1:701258067469:web:d2387e6bae683e7d06ef44",
};

const app = initializeApp(firebaseConfig);

// google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;

  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((error) => {
      toast.error("Google authentication failed. Please try again.");
    });

  return user;
};
