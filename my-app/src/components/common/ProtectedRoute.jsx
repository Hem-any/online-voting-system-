import { useVoteAuth } from "../../context/VoteAuthContext";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useVoteAuth();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/vote/login" replace />;
  }

  return children;
}