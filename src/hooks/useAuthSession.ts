
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { User, AuthState } from '@/types/auth';

export function useAuthSession() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    customPrivileges: []
  });

  useEffect(() => {
    // Fetch the user session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        handleSession(session);
      } catch (error) {
        console.error('Error getting session:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    getSession();

    // Set up a listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleSession(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle session and user data
  const handleSession = async (session: Session | null) => {
    if (!session) {
      setAuthState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        customPrivileges: []
      });
      return;
    }

    try {
      // Fetch additional user profile data from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }

      // Create a user object from session and profile data
      const user: User = {
        id: session.user.id,
        email: session.user.email || '',
        name: profileData?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Anonymous',
        role: profileData?.role || session.user.user_metadata?.role || 'employee',
        companyId: profileData?.company_id || session.user.user_metadata?.company_id,
        company_id: profileData?.company_id || session.user.user_metadata?.company_id,
        avatar: profileData?.avatar_url || session.user.user_metadata?.avatar_url,
        avatarUrl: profileData?.avatar_url || session.user.user_metadata?.avatar_url,
        avatar_url: profileData?.avatar_url || session.user.user_metadata?.avatar_url,
        user_metadata: session.user.user_metadata
      };

      // Fetch user custom privileges
      const { data: privileges, error: privilegesError } = await supabase
        .from('user_custom_privileges')
        .select('*')
        .eq('user_id', user.id);

      if (privilegesError) {
        console.error('Error fetching user privileges:', privilegesError);
      }

      setAuthState({
        user,
        session,
        isAuthenticated: true,
        isLoading: false,
        customPrivileges: privileges || []
      });
    } catch (error) {
      console.error('Error processing session:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return authState;
}
