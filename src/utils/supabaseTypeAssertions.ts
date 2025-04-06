
import { supabase } from '@/integrations/supabase/client';
import { DocumentTableName } from '@/types/documents';

/**
 * Type-safe function to get a Supabase query builder for document tables
 */
export const fromDocumentTable = (tableName: DocumentTableName) => {
  return supabase.from(tableName);
};

/**
 * Type-safe function to get a Supabase storage bucket
 */
export const fromStorageBucket = (bucketName: string) => {
  return supabase.storage.from(bucketName);
};

/**
 * Type-safe wrapper for Supabase authentication functions
 */
export const supabaseAuth = {
  signIn: (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  },
  signUp: (email: string, password: string, userData?: any) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
  },
  signOut: () => {
    return supabase.auth.signOut();
  },
  getUser: () => {
    return supabase.auth.getUser();
  },
  getSession: () => {
    return supabase.auth.getSession();
  }
};
