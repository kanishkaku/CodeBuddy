import { createClient } from '@supabase/supabase-js'

// Create a simple Supabase client with environment variables
// Since we've moved the .env file to the client directory, Vite should pick it up
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Print the first few characters of the URL to verify (without exposing full credentials)
if (supabaseUrl && typeof supabaseUrl === 'string') {
  console.log(`Supabase URL found (starts with: ${supabaseUrl.substring(0, 8)}...)`)
}

// Create the client with proper type checking
const supabase = createClient(
  supabaseUrl ? String(supabaseUrl) : '', 
  supabaseAnonKey ? String(supabaseAnonKey) : ''
)

export { supabase }

export type Profile = {
  id: string
  username: string
  displayName: string
  avatarInitials: string
  role: string
  level: string
  levelProgress: number
}

// These functions are no longer used as they require a Supabase profiles table
// Instead, we're using our backend to manage user profiles

// Function to get user profile (deprecated - not used)
export async function getUserProfile(userId: string): Promise<Profile | null> {
  console.warn('getUserProfile is deprecated. Use backend API instead.')
  return null;
}

// Function to create or update user profile (deprecated - not used)
export async function upsertUserProfile(profile: Partial<Profile> & { id: string }): Promise<Profile | null> {
  console.warn('upsertUserProfile is deprecated. Use backend API instead.')
  return null;
}