import { createClient } from '@supabase/supabase-js'

// Try to get Supabase credentials from different environment variable formats
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.SUPABASE_URL || 
  ''

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.SUPABASE_ANON_KEY || 
  ''

// For development without Supabase, use a fallback if credentials are missing
const FALLBACK_URL = 'https://example.supabase.co'
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE2ODQxODk0MDB9.gDJedGmfaDnVuyGAo3BxzK9io00y3H1QBRqkjT_JaGI'

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Using fallback Supabase credentials. Authentication features will be limited.')
}

// Use real credentials if available, otherwise use fallbacks for development
export const supabase = createClient(
  supabaseUrl || FALLBACK_URL,
  supabaseAnonKey || FALLBACK_KEY
)

export type Profile = {
  id: string
  username: string
  displayName: string
  avatarInitials: string
  role: string
  level: string
  levelProgress: number
}

// Function to get user profile
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error || !data) {
    console.error('Error fetching user profile:', error)
    return null
  }
  
  return data
}

// Function to create or update user profile
export async function upsertUserProfile(profile: Partial<Profile> & { id: string }): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single()
  
  if (error) {
    console.error('Error upserting profile:', error)
    return null
  }
  
  return data
}