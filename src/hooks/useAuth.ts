
// This file serves as a redirector to our consolidated auth context
// to maintain compatibility with existing imports

import { useAuth as useAuthContext } from '@/contexts/auth/AuthContext';

export const useAuth = useAuthContext;

// For backward compatibility with direct imports
export { AuthProvider } from '@/contexts/auth/AuthProvider';
