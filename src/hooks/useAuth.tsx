import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, handleSessionError } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  sessionError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Function to handle session recovery
    const initializeAuth = async () => {
      try {
        setLoading(true);
        setSessionError(null);

        // Try to get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session recovery error:', error);
          
          // Handle session recovery errors
          const wasCleared = await handleSessionError(error);
          
          if (wasCleared) {
            setSessionError('Your session has expired. Please sign in again.');
            setSession(null);
            setUser(null);
            
            // Redirect to landing page after a brief delay
            setTimeout(() => {
              if (mounted && window.location.pathname !== '/') {
                window.location.href = '/';
              }
            }, 2000);
          }
        } else if (session) {
          // Valid session found
          setSession(session);
          setUser(session.user);
          setSessionError(null);
        } else {
          // No session found (user not logged in)
          setSession(null);
          setUser(null);
          setSessionError(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        
        // Handle any unexpected errors during initialization
        const wasCleared = await handleSessionError(error);
        
        if (wasCleared) {
          setSessionError('Authentication error. Please sign in again.');
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          if (event === 'SIGNED_OUT') {
            setSession(null);
            setUser(null);
            setSessionError(null);
          } else if (session) {
            setSession(session);
            setUser(session.user);
            setSessionError(null);
          }
        } else if (event === 'SIGNED_IN' && session) {
          setSession(session);
          setUser(session.user);
          setSessionError(null);
        } else if (event === 'USER_UPDATED' && session) {
          setSession(session);
          setUser(session.user);
        }
        
        setLoading(false);
      }
    );

    // Initialize authentication
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setSessionError(null);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: fullName ? { full_name: fullName } : undefined
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setSessionError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        
        // Handle specific auth errors
        if (error.message?.includes('Invalid login credentials')) {
          return { error: { ...error, message: 'Invalid email or password. Please check your credentials and try again.' } };
        }
        
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setSessionError(null);
      
      // Use global scope to ensure complete logout
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Sign out error:', error);
        
        // Even if signOut fails, clear local state
        setSession(null);
        setUser(null);
        localStorage.clear();
        sessionStorage.clear();
        
        return { error };
      }

      // Clear local state
      setSession(null);
      setUser(null);
      
      // Clear any remaining local storage
      localStorage.clear();
      sessionStorage.clear();
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      
      // Force clear local state even on error
      setSession(null);
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    sessionError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}