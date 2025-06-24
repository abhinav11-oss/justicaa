import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Scale } from "lucide-react";
import { AuthForm } from "@/components/AuthForm"; // Import the new AuthForm

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const handleAuthSuccess = () => {
    onClose();
    // Optionally, you might want to refresh the page or redirect after successful auth
    // For example, if this modal is used for trial mode, you might want to clear trial state
    localStorage.removeItem('trialMode');
    localStorage.removeItem('trialMessagesUsed');
    window.location.href = '/dashboard'; // Redirect to dashboard
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary p-3 rounded-lg">
              <Scale className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold">
            Welcome to Justicaa
          </DialogTitle>
        </DialogHeader>
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      </DialogContent>
    </Dialog>
  );
};