import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
}

const loadInitialUser = (): { user: User | null; isAuthenticated: boolean } => {
  try {
    const stored = localStorage.getItem('authUser');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.id) {
        return { user: parsed, isAuthenticated: true };
      }
    }
  } catch (e) {
    console.error('Error loading stored user:', e);
  }

  // If user hasn't explicitly clicked logout, default to User 1
  const wasLoggedOut = localStorage.getItem('wasLoggedOut');
  if (wasLoggedOut !== 'true') {
    const defaultUser: User = {
      id: '1',
      email: 'user1@example.com',
      name: 'John Doe',
      role: 'Administrator',
    };
    return { user: defaultUser, isAuthenticated: true };
  }

  return { user: null, isAuthenticated: false };
};

const initial = loadInitialUser();

const initialState: AuthState = {
  user: initial.user,
  isAuthenticated: initial.isAuthenticated,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      try {
        localStorage.setItem('authUser', JSON.stringify(action.payload));
        localStorage.removeItem('wasLoggedOut');
      } catch (e) {
        console.error('Error saving user to localStorage:', e);
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      try {
        localStorage.removeItem('authUser');
        localStorage.setItem('wasLoggedOut', 'true');
      } catch (e) {
        console.error('Error clearing user from localStorage:', e);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginSuccess, loginFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
