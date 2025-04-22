import { useAuth0 } from "@auth0/auth0-react";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login First");
    }
  }, [isAuthenticated]);

  return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;
