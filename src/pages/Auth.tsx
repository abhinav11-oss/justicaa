import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";

const Auth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard on successful auth
  useEffect(() => {
    if (user) {
      // Send message to parent window for popup flow (legacy support)
      if (window.opener) {
        window.opener.postMessage(
          { type: "AUTH_SUCCESS", user },
          window.location.origin
        );
        window.close();
      } else {
        // Navigate to dashboard using React Router
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const handleAuthSuccess = () => {
    if (window.opener) {
      window.opener.postMessage(
        { type: "AUTH_SUCCESS", user },
        window.location.origin
      );
      window.close();
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <AuthForm onAuthSuccess={handleAuthSuccess} />
    </div>
  );
};

export default Auth;