import { DumbbellIcon, HomeIcon, UserIcon, ZapIcon } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

function Navbar() {
  const {
    loginWithRedirect,
    isAuthenticated,
    logout,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Get the access token silently
        const token = await getAccessTokenSilently();

        // Send user data and token to backend via axios
        const response = await axios.post(
          "https://codeflex-wjlg.onrender.com/api/protected-route",
          { token, user },
          {
            headers: {
              "Content-Type": "application/json", // Ensure correct content type
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Protected route response:", response.data); // Access response data directly
      } catch (error) {
        console.error("Error fetching protected data:", error);
      }
    }

    if (isAuthenticated) {
      fetchUserData(); // Fetch user data if authenticated
    }
  }, [getAccessTokenSilently, isAuthenticated, user]); // Ensure user data is updated in dependencies

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1 bg-primary/10 rounded">
            <ZapIcon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold font-mono">
            code<span className="text-primary">flex</span>.ai
          </span>
        </Link>

        <nav className="flex items-center gap-5">
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
              >
                <HomeIcon size={16} />
                <span>Home</span>
              </Link>

              <Link
                to="/generate"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
              >
                <DumbbellIcon size={16} />
                <span>Generate</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
              >
                <UserIcon size={16} />
                <span>Profile</span>
              </Link>
              <Button
                asChild
                variant="outline"
                className="ml-2 border-primary/50 text-primary hover:text-white hover:bg-primary/10"
              >
                <Link to="/generate-program">Get Started</Link>
              </Button>
              <Button
                onClick={() => logout()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={"outline"}
                onClick={() => loginWithRedirect()}
                className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
              >
                Sign In
              </Button>
              <Button
                onClick={() => loginWithRedirect()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign Up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
