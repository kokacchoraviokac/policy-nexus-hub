
import { useContext, useState } from 'react';
import { AuthContext } from '@/contexts/auth/AuthContext';
import { AuthState, CustomPrivilege } from '@/types/auth';

export function useAuthSession() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthSession must be used within an AuthProvider');
  }
  
  // Create a local state for auth management
  const [authState, setAuthState] = useState<AuthState>({
    user: context.user,
    session: context.session || null,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading
  });
  
  // Create a state for custom privileges
  const [customPrivileges, setCustomPrivileges] = useState<CustomPrivilege[]>([]);
  
  return {
    authState,
    setAuthState,
    customPrivileges,
    setCustomPrivileges
  };
}
