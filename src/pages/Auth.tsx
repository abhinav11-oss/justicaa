import { useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";

const Auth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAuthSuccess = useCallback(() => {
    if (window.opener) {
      window.opener.postMessage(
        { type: "AUTH_SUCCESS", user },
        window.location.origin
      );
      window.close();
    } else {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Redirect to dashboard on successful auth
  useEffect(() => {
    if (user) handleAuthSuccess();
  }, [user, handleAuthSuccess]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <AuthForm onAuthSuccess={handleAuthSuccess} />
    </div>
  );
};

export default Auth;