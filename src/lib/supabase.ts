import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
const isConfigured = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key-here' &&
  supabaseUrl.startsWith('https://');

if (!isConfigured) {
  console.warn('⚠️ Supabase not configured - using demo mode');
  console.warn('To enable full functionality:');
  console.warn('1. Create a Supabase project at https://supabase.com');
  console.warn('2. Get your project URL and anon key from Settings > API');
  console.warn('3. Update .env.local with your actual credentials');
}

// Create a mock client for demo purposes when not configured
const createMockClient = () => ({
  auth: {
    signUp: async () => ({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null } }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: null } }),
  },
  from: () => ({
    select: () => ({
      order: () => ({ data: [], error: null }),
      eq: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null }),
    }),
    insert: () => ({
      select: () => ({
        single: () => ({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
      }),
    }),
    update: () => ({
      eq: () => ({ error: { message: 'Demo mode - Supabase not configured' } }),
    }),
  }),
});

export const supabase = isConfigured 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : createMockClient() as any;

// Auth helpers
export const signUp = async (email: string, password: string) => {
  if (!isConfigured) {
    return { data: null, error: { message: 'Demo mode - Please configure Supabase to enable authentication' } };
  }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  if (!isConfigured) {
    return { data: null, error: { message: 'Demo mode - Please configure Supabase to enable authentication' } };
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  if (!isConfigured) {
    return { error: null };
  }
  
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  if (!isConfigured) {
    return { user: null, error: null };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};