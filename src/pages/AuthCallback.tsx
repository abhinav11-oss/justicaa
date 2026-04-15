import { useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const callbackError = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("error_description") || params.get("error");
  }, []);

  useEffect(() => {
    if (callbackError) {
      toast({
        title: "Google Sign In Failed",
        description: decodeURIComponent(callbackError),
        variant: "destructive",
      });
      navigate("/auth", { replace: true });
      return;
    }

    if (!loading && user) {
      navigate("/dashboard", { replace: true });
      return;
    }

    if (!loading && !user) {
      toast({
        title: "Sign-in session not found",
        description:
          "Google sign-in did not complete. Please try again after checking your Supabase redirect URLs.",
        variant: "destructive",
      });
      navigate("/auth", { replace: true });
    }
  }, [callbackError, loading, navigate, toast, user]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <h1 className="text-xl font-semibold">Completing sign-in</h1>
        <p className="text-sm text-muted-foreground">
          We&apos;re finishing your Google authentication and redirecting you.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
