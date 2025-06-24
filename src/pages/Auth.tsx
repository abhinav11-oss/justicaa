import { useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Scale, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm"; // Import the new AuthForm

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
          window.location.origin,
        );
        window.close();
      } else {
        // Navigate to dashboard using React Router
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const handleAuthSuccess = () => {
    // AuthForm will handle toast messages, just navigate here
    if (window.opener) {
      window.opener.postMessage(
        { type: "AUTH_SUCCESS", user },
        window.location.origin,
      );
      window.close();
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="gradient-primary p-3 rounded-xl">
              <Scale className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Justicaa</h1>
          <p className="text-muted-foreground">Your AI Legal Assistant</p>
        </div>

        {/* Auth Form */}
        <AuthForm onAuthSuccess={handleAuthSuccess} />

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;