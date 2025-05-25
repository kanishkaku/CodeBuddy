import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  User, 
  Session, 
  AuthChangeEvent, 
  AuthError
} from '@supabase/supabase-js'
import { supabase, getUserProfile, upsertUserProfile, type Profile } from '../lib/supabase'
import { useToast } from '../hooks/use-toast'
import { apiRequest } from '../lib/queryClient'

interface AuthContextType {
  user: User | null
  profile: Profile | null 
  session: Session | null
  isLoading: boolean
  signInWithEmailPassword: (email: string, password: string) => Promise<void>
  signUpWithEmailPassword: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    console.log("Auth hook initializing...");
    
    // Set up Supabase auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        console.log(`Auth state changed: ${event}`, currentSession ? "Session exists" : "No session");
        
        setSession(currentSession)
        setUser(currentSession?.user || null)
        
        if (event === 'SIGNED_IN' && currentSession?.user) {
          setIsLoading(true)
          console.log("User signed in, syncing with backend...");
          
          try {
            // Create a simplified profile to avoid backend calls during development
            // This helps bypass any backend API issues temporarily
            const userProfile: Profile = {
              id: currentSession.user.id,
              username: currentSession.user.email?.split('@')[0] || 'user',
              displayName: currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0] || 'User',
              avatarInitials: (currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0] || 'US').substring(0, 2).toUpperCase(),
              role: 'Student',
              level: 'beginner',
              levelProgress: 0
            };
            
            setProfile(userProfile);
            console.log("Created temporary profile:", userProfile);
            
            // Try synchronizing with the backend
            try {
              // Sync user with our backend server
              const userData = {
                id: currentSession.user.id,
                email: currentSession.user.email,
                user_metadata: currentSession.user.user_metadata
              }
              
              console.log("Sending user data to backend:", userData);
              
              // Send user data to our backend to create/sync user
              const response = await apiRequest('/api/supabase-auth-user', {
                method: 'POST',
                body: JSON.stringify(userData),
                headers: {
                  'Authorization': `Bearer ${currentSession.access_token}`
                }
              })
              
              // Use the response from our backend API as the profile
              if (response) {
                try {
                  const backendUser = await response.json();
                  console.log("Backend user received:", backendUser);
                  
                  // Convert backend user to our Profile type
                  const backendProfile: Profile = {
                    id: currentSession.user.id,
                    username: backendUser.username || userProfile.username,
                    displayName: backendUser.displayName || userProfile.displayName,
                    avatarInitials: backendUser.avatarInitials || userProfile.avatarInitials,
                    role: backendUser.role || userProfile.role,
                    level: backendUser.level || userProfile.level,
                    levelProgress: backendUser.levelProgress || userProfile.levelProgress
                  };
                  
                  setProfile(backendProfile);
                  console.log("Updated profile from backend:", backendProfile);
                } catch (error) {
                  console.error('Error parsing user profile from backend:', error);
                  // Keep using the temporary profile
                }
              }
            } catch (error) {
              console.error('Error syncing user data with backend:', error);
              toast({
                title: 'Continuing with temporary profile',
                description: 'Unable to sync with backend, but you can still use the app.',
                variant: 'default',
              });
              // Keep using the temporary profile
            }
          } catch (error) {
            console.error('Error in auth flow:', error);
            toast({
              title: 'Authentication error',
              description: 'There was an error with the authentication process. Please try again.',
              variant: 'destructive',
            });
          } finally {
            setIsLoading(false);
            console.log("Auth loading completed");
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          setProfile(null);
          setIsLoading(false);
        } else {
          // For other events, ensure we're not stuck in loading state
          setIsLoading(false);
        }
      }
    )

    // Initial session check
    const initializeAuth = async () => {
      console.log("Initializing auth - checking for existing session");
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setIsLoading(false);
          return;
        }
        
        console.log("Session check result:", data.session ? "Session exists" : "No session");
        setSession(data.session);
        setUser(data.session?.user || null);
        
        if (data.session?.user) {
          console.log("Existing user found, creating profile");
          
          // Create a simplified profile
          const userProfile: Profile = {
            id: data.session.user.id,
            username: data.session.user.email?.split('@')[0] || 'user',
            displayName: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0] || 'User',
            avatarInitials: (data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0] || 'US').substring(0, 2).toUpperCase(),
            role: 'Student',
            level: 'beginner',
            levelProgress: 0
          };
          
          setProfile(userProfile);
          console.log("Created temporary profile:", userProfile);
          
          // Try synchronizing with backend
          try {
            // Sync user with our backend server
            const userData = {
              id: data.session.user.id,
              email: data.session.user.email,
              user_metadata: data.session.user.user_metadata
            }
            
            console.log("Sending user data to backend:", userData);
            
            // Send user data to our backend to create/sync user
            const response = await apiRequest('/api/supabase-auth-user', {
              method: 'POST',
              body: JSON.stringify(userData),
              headers: {
                'Authorization': `Bearer ${data.session.access_token}`
              }
            })
            
            // Use the response from our backend API as the profile
            if (response) {
              try {
                const backendUser = await response.json();
                console.log("Backend user received:", backendUser);
                
                // Convert backend user to our Profile type
                const backendProfile: Profile = {
                  id: data.session.user.id,
                  username: backendUser.username || userProfile.username,
                  displayName: backendUser.displayName || userProfile.displayName,
                  avatarInitials: backendUser.avatarInitials || userProfile.avatarInitials,
                  role: backendUser.role || userProfile.role,
                  level: backendUser.level || userProfile.level,
                  levelProgress: backendUser.levelProgress || userProfile.levelProgress
                };
                
                setProfile(backendProfile);
                console.log("Updated profile from backend:", backendProfile);
              } catch (error) {
                console.error('Error parsing user profile from backend:', error);
                // Keep using the temporary profile
              }
            }
          } catch (error) {
            console.error('Error syncing user data with backend:', error);
            // Keep using the temporary profile
          }
        }
      } catch (error) {
        console.error('Error during authentication initialization:', error);
      } finally {
        console.log("Auth initialization completed, setting isLoading to false");
        setIsLoading(false);
      }
    }

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    }
  }, [])

  // GitHub sign-in method has been removed
  
  const signInWithEmailPassword = async (email: string, password: string) => {
    try {
      console.log('Attempting email/password sign in');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Email/password sign in error details:', error);
        throw error;
      }
      
      console.log('Email/password sign in successful, user data:', data);
    } catch (error: unknown) {
      const authError = error as AuthError
      console.error('Error signing in with email/password:', authError)
      toast({
        title: 'Authentication error',
        description: `Failed to sign in: ${authError.message}`,
        variant: 'destructive',
      })
    }
  }
  
  const signUpWithEmailPassword = async (email: string, password: string, displayName: string) => {
    try {
      console.log('Attempting email/password sign up for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: displayName
          }
        }
      })
      
      if (error) {
        console.error('Sign up error details:', error);
        throw error;
      }
      
      console.log('Sign up response:', data);
      
      toast({
        title: 'Account created',
        description: 'Please check your email to confirm your account.',
      })
    } catch (error: unknown) {
      const authError = error as AuthError
      console.error('Error signing up:', authError)
      toast({
        title: 'Sign up error',
        description: `Failed to create account: ${authError.message}`,
        variant: 'destructive',
      })
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // After sign out
      setUser(null)
      setProfile(null)
      setSession(null)
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      })
    } catch (error: unknown) {
      const authError = error as AuthError
      console.error('Error signing out:', authError)
      toast({
        title: 'Error signing out',
        description: authError.message || 'Failed to sign out',
        variant: 'destructive',
      })
    }
  }

  // Make sure the value object matches the interface exactly
  const value: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    signInWithEmailPassword,
    signUpWithEmailPassword,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}