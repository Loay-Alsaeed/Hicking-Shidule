import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading, Please Wait ...</p>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
