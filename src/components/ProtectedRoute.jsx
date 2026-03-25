import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import VerifyEmailScreen from "./auth/VerifyEmailScreen";

export default function ProtectedRoute({ children }) {
  const { user, needsVerify } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (needsVerify) return <VerifyEmailScreen />;

  return children;
}
