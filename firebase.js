// js/firebase.js — shared Firebase setup for the whole site
// Every page imports { auth, db, storage } from this file so there's
// only ONE place the config lives.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
  onSnapshot,
  increment,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

// ⚠️ SET THIS to the one email address that should have admin access.
// This same email must ALSO be pasted into firestore.rules (search for
// ADMIN_EMAIL there) — the two have to match exactly or admin actions
// will be silently rejected by Firestore.
export const ADMIN_EMAIL = "youradmin@example.com";

const firebaseConfig = {
  apiKey: "AIzaSyACumi3u3kalpxOig0XypX7LuiZnNZwm6c",
  authDomain: "dream-f852d.firebaseapp.com",
  projectId: "dream-f852d",
  storageBucket: "dream-f852d.firebasestorage.app",
  messagingSenderId: "915400375437",
  appId: "1:915400375437:web:ef96e9ff3aaaab9ce4b6c4",
  measurementId: "G-E6MFTZG44Z"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Re-export the Firestore/Storage/Auth helper functions so pages only
// need one import line: `import { auth, db, ... } from "./js/firebase.js"`
export {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
  onSnapshot,
  increment,
  updateDoc,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
};

// ---- Small shared helper: require login before an action ----
export function requireAuth(user, actionName = "do this") {
  if (!user) {
    alert(`Please log in to ${actionName}.`);
    window.location.href = "auth.html";
    return false;
  }
  return true;
}

// ---- Checks whether a logged-in user has been deactivated by admin ----
// Returns true if active (or if no users/{uid} doc exists yet — treats
// missing records as active so this never locks out existing accounts).
export async function isUserActive(uid) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return true;
    return snap.data().active !== false;
  } catch {
    return true;
  }
}

// ---- Signs a deactivated user out and sends them home with a message ----
export async function guardActiveUser(user) {
  if (!user) return true;
  const active = await isUserActive(user.uid);
  if (!active) {
    await signOut(auth);
    alert("Your account has been deactivated. Contact the site owner if you think this is a mistake.");
    window.location.href = "index.html";
    return false;
  }
  return true;
}
