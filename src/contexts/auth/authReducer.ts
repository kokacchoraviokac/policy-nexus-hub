
import { AuthContextType } from "./types";
import { User, Session } from "@supabase/supabase-js";

export type AuthState = {
  user: User | null;
  session: Session | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: any | null;
  role: string | null;
  companyId: string | null;
  customPrivileges: any[];
};

export type AuthAction = 
  | { type: 'INITIALIZE'; payload: { isAuthenticated: boolean; user: User | null; session: Session | null } }
  | { type: 'LOGIN'; payload: { user: User; session: Session } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER_PROFILE'; payload: any }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'AUTH_SUCCESS'; payload: { session: Session; user: any; customPrivileges?: any[] } }
  | { type: 'AUTH_FAIL' }
  | { type: 'AUTH_START' }
  | { type: 'SIGN_OUT' }
  | { type: 'AUTH_INITIALIZED' };

export const initialState: AuthState = {
  user: null,
  session: null,
  isInitialized: false,
  isAuthenticated: false,
  isLoading: true,
  userProfile: null,
  role: null,
  companyId: null,
  customPrivileges: []
};

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        isInitialized: true,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        session: action.payload.session,
        isLoading: false
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        session: action.payload.session,
        isLoading: false
      };
    case 'LOGOUT':
    case 'SIGN_OUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        session: null,
        userProfile: null,
        role: null,
        companyId: null,
        customPrivileges: []
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_USER_PROFILE':
      const profile = action.payload;
      return {
        ...state,
        userProfile: profile,
        role: profile?.role || null,
        companyId: profile?.company_id || null
      };
    case 'UPDATE_USER':
      if (!state.user) return state;
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        session: action.payload.session,
        isLoading: false,
        customPrivileges: action.payload.customPrivileges || []
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        isLoading: false
      };
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true
      };
    case 'AUTH_INITIALIZED':
      return {
        ...state,
        isInitialized: true,
        isLoading: false
      };
    default:
      return state;
  }
};
