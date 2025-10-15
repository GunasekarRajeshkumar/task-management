import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import * as AuthActions from '../actions/auth.actions';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  
  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false,
    error: null
  })),
  
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error
  })),
  
  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AuthActions.registerSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false,
    error: null
  })),
  
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error
  })),
  
  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true
  })),
  
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  })),
  
  // Token Actions
  on(AuthActions.checkAuth, (state) => ({
    ...state,
    loading: true
  })),
  
  on(AuthActions.tokenExpired, (state) => ({
    ...state,
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: 'Session expired. Please log in again.'
  })),
  
  // Clear Error
  on(AuthActions.clearAuthError, (state) => ({
    ...state,
    error: null
  }))
);
