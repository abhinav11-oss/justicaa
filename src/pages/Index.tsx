import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TypewriterLoader } from "@/components/loaders/TypewriterLoader";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Always redirect to landing page
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8">
      <TypewriterLoader />
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
};

export default Index;