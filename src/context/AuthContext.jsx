import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [needsVerify, setNeedsVerify] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Check email verification
        // Google users are always verified
        const isGoogle = firebaseUser.providerData.some(
          (p) => p.providerId === "google.com",
        );
        const isVerified = isGoogle || firebaseUser.emailVerified;

        if (!isVerified) {
          setNeedsVerify(true);
          setUser(firebaseUser);
          setLoading(false);
          return;
        }

        setNeedsVerify(false);
        setUser(firebaseUser);

        // Sync to MongoDB
        try {
          await api.post("/api/users/sync", {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        } catch (err) {
          console.error("User sync failed:", err);
        }
      } else {
        setUser(null);
        setNeedsVerify(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, needsVerify }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
