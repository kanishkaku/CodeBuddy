import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  User, 
  Session, 
  AuthChangeEvent, 
  AuthError
} from '@supabase/supabase-js'
import { supabase, getUserProfile, upsertUserProfile, type Profile } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { apiRequest } from '@/lib/queryClient'

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
    // Set up Supabase auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        setSession(currentSession)
        setUser(currentSession?.user || null)
        
        if (event === 'SIGNED_IN' && currentSession?.user) {
          setIsLoading(true)
          
          try {
            // Fetch user profile from Supabase
            const userProfile = await getUserProfile(currentSession.user.id)
            
            // Sync user with our backend server
            const userData = {
              id: currentSession.user.id,
              email: currentSession.user.email,
              user_metadata: currentSession.user.user_metadata
            }
            
            // Send user data to our backend to create/sync user
            await apiRequest('/api/supabase-auth-user', {
              method: 'POST',
              body: JSON.stringify(userData),
              headers: {
                'Authorization': `Bearer ${currentSession.access_token}`
              }
            })
            
            if (!userProfile) {
              // Create a new profile for first-time users
              const email = currentSession.user.email || ''
              const displayName = currentSession.user.user_metadata?.name || email.split('@')[0] || 'User'
              const initials = displayName.substring(0, 2).toUpperCase()
              
              const newProfile = {
                id: currentSession.user.id,
                username: email.split('@')[0] || `user_${Date.now()}`,
                displayName: displayName,
                avatarInitials: initials,
                role: 'Student',
                level: 'beginner',
                levelProgress: 0
              }
              
              const createdProfile = await upsertUserProfile(newProfile)
              if (createdProfile) {
                setProfile(createdProfile)
              }
            } else {
              setProfile(userProfile)
            }
          } catch (error) {
            console.error('Error syncing user data:', error)
            toast({
              title: 'Error syncing user data',
              description: 'There was an error syncing your user data with our servers.',
              variant: 'destructive',
            })
          } finally {
            setIsLoading(false)
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null)
        }
      }
    )

    // Initial session check
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setSession(data.session)
        setUser(data.session?.user || null)
        
        if (data.session?.user) {
          // Sync user with our backend server
          const userData = {
            id: data.session.user.id,
            email: data.session.user.email,
            user_metadata: data.session.user.user_metadata
          }
          
          // Send user data to our backend to create/sync user
          await apiRequest('/api/supabase-auth-user', {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
              'Authorization': `Bearer ${data.session.access_token}`
            }
          })
          
          const userProfile = await getUserProfile(data.session.user.id)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Error during authentication initialization:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    return () => {
      subscription.unsubscribe()
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