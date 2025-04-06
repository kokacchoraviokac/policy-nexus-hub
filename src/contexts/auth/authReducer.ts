
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
};

export type AuthAction = 
  | { type: 'INITIALIZE'; payload: { isAuthenticated: boolean; user: User | null; session: Session | null } }
  | { type: 'LOGIN'; payload: { user: User; session: Session } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER_PROFILE'; payload: any }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

export const initialState: AuthState = {
  user: null,
  session: null,
  isInitialized: false,
  isAuthenticated: false,
  isLoading: true,
  userProfile: null,
  role: null,
  companyId: null
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
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        session: null,
        userProfile: null,
        role: null,
        companyId: null
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
    default:
      return state;
  }
};
