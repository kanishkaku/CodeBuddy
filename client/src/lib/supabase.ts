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