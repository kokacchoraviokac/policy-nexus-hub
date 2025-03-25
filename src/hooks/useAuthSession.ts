
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth/AuthContext';

export function useAuthSession() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthSession must be used within an AuthProvider');
  }
  
  return context;
}
