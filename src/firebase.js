import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ── Google ────────────────────────────────────────────────────────────────
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

// ── Email / Password ──────────────────────────────────────────────────────
export async function registerWithEmail(email, password, displayName) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  // Set display name immediately
  await updateProfile(result.user, { displayName });
  // Send verification email
  await sendEmailVerification(result.user);
  return result.user;
}

export async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function resendVerificationEmail() {
  if (auth.currentUser && !auth.currentUser.emailVerified) {
    await sendEmailVerification(auth.currentUser);
  }
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

// ── Profile ───────────────────────────────────────────────────────────────
export async function updateFirebaseProfile(displayName, photoURL) {
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName: displayName || auth.currentUser.displayName,
      photoURL: photoURL || auth.currentUser.photoURL,
    });
  }
}

// ── Avatar upload via ImgBB ───────────────────────────────────────────────
export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    { method: "POST", body: formData },
  );
  const data = await res.json();
  if (!data.success) throw new Error("Image upload failed");
  return data.data.url;
}
