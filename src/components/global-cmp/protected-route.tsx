import { Navigate, useLocation } from "react-router-dom";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { useStore } from "../../utils/zustsore";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Initiate authentication check when component mounts
    checkAuth();
  }, []);

  /**
   * Handles user authentication and session setup with websocket.
   */
  const checkAuth = async () => {
    try {
      // Fetch user attributes and session details
      const userData = await fetchUserAttributes();
      const session = await fetchAuthSession();
      useStore.setState({
        userDetails: {
          email: userData.email as string,
          bucketId: userData["custom:bucketId"] as string,
        },
      });
      // Extract the ID token for websocket connection
      const idToken = session?.tokens?.idToken;
      if (!idToken) throw new Error("ID token not found in session");
      // Mark authentication as successful
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Authentication error:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Display a loading screen while authentication check is in progress
  if (isLoading) {
    return (
      <div className="w-screen h-screen grid place-items-center relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="loadingFiles"></span>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render child components for authenticated users
  return <>{children}</>;
};
