import { useAuth0 } from "@auth0/auth0-react";
import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  // if (isLoading)
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <Loader></Loader>
  //     </div>
  //   );
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;
