"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock } from "lucide-react";

interface AuthFormProps {
  onAuthSuccess?: () => void;
}

export const AuthForm = ({ onAuthSuccess }: AuthFormProps) => {
  const [authMode, setAuthMode] = useState<"signin" | "signup" | "forgot">(
    "signin"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) throw error;
      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in.",
      });
      onAuthSuccess?.();
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(formData.email, formData.password);
      if (error) throw error;
      toast({
        title: "Account Created!",
        description: "Please check your email to confirm your account.",
      });
      onAuthSuccess?.();
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await resetPassword(formData.email);
      if (error) throw error;
      toast({
        title: "Reset Email Sent",
        description: "Please check your email for password reset instructions.",
      });
      setAuthMode("signin");
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google Sign In Failed",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };

  const renderSignIn = () => (
    <form onSubmit={handleSignIn}>
      <div className="flex-column">
        <label>Email</label>
        <div className="inputForm">
          <Mail className="h-4 w-4 text-gray-400" />
          <input
            name="email"
            type="email"
            className="input"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex-column">
        <label>Password</label>
        <div className="inputForm">
          <Lock className="h-4 w-4 text-gray-400" />
          <input
            name="password"
            type="password"
            className="input"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex-row">
        <div>
          <input type="checkbox" id="rememberMe" />
          <label htmlFor="rememberMe">Remember me</label>
        </div>
        <span className="span" onClick={() => setAuthMode("forgot")}>
          Forgot password?
        </span>
      </div>
      <button type="submit" className="button-submit" disabled={isLoading}>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        Sign In
      </button>
      <p className="p">
        Don't have an account?
        <span className="span" onClick={() => setAuthMode("signup")}>
          Sign Up
        </span>
      </p>
    </form>
  );

  const renderSignUp = () => (
    <form onSubmit={handleSignUp}>
      <div className="flex-column">
        <label>Email</label>
        <div className="inputForm">
          <Mail className="h-4 w-4 text-gray-400" />
          <input
            name="email"
            type="email"
            className="input"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex-column">
        <label>Password</label>
        <div className="inputForm">
          <Lock className="h-4 w-4 text-gray-400" />
          <input
            name="password"
            type="password"
            className="input"
            placeholder="Enter your Password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex-column">
        <label>Confirm Password</label>
        <div className="inputForm">
          <Lock className="h-4 w-4 text-gray-400" />
          <input
            name="confirmPassword"
            type="password"
            className="input"
            placeholder="Confirm your Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <button type="submit" className="button-submit" disabled={isLoading}>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        Sign Up
      </button>
      <p className="p">
        Already have an account?
        <span className="span" onClick={() => setAuthMode("signin")}>
          Sign In
        </span>
      </p>
    </form>
  );

  const renderForgotPassword = () => (
    <form onSubmit={handleForgotPassword}>
      <div className="flex-column">
        <label>Email</label>
        <div className="inputForm">
          <Mail className="h-4 w-4 text-gray-400" />
          <input
            name="email"
            type="email"
            className="input"
            placeholder="Enter your Email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
      </div>
      <button type="submit" className="button-submit" disabled={isLoading}>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        Send Reset Link
      </button>
      <p className="p">
        Remembered your password?
        <span className="span" onClick={() => setAuthMode("signin")}>
          Sign In
        </span>
      </p>
    </form>
  );

  return (
    <div className="auth-form-container">
      {authMode === "signin" && renderSignIn()}
      {authMode === "signup" && renderSignUp()}
      {authMode === "forgot" && renderForgotPassword()}

      <p className="p">or sign in with</p>

      <button
        type="button"
        className="btn"
        onClick={handleGoogleSignIn}
        disabled={isLoading || isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5"
          >
            <g>
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              ></path>
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              ></path>
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </g>
          </svg>
        )}
        Continue with Google
      </button>
    </div>
  );
};