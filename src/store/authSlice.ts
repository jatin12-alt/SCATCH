import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';

// custom profile type for our vegan e-commerce users
interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'owner';
}

interface AuthState {
  account: UserProfile | null;
  isAuthenticating: boolean;
  authError: string | null;
}

const initialState: AuthState = {
  account: null,
  isAuthenticating: true, // we start in a loading state to check the session
  authError: null,
};

/**
 * Validates the current session on app mount or refresh.
 * We're fetching from the 'profiles' table to get the custom 'role' field.
 */
export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  return profile as UserProfile;
});

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, fullName }: { email: string; password: string; fullName: string }, { rejectWithValue }) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Registration failed - no user returned');

      // Fetch the auto-created profile record
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      return profile as UserProfile;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Something went wrong during signup');
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      return profile as UserProfile;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login attempt failed');
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  await supabase.auth.signOut();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.authError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Session Check
      .addCase(checkAuth.pending, (state) => {
        state.isAuthenticating = true;
      })
      .addCase(checkAuth.fulfilled, (state, { payload }) => {
        state.isAuthenticating = false;
        state.account = payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticating = false;
        state.account = null;
      })
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.isAuthenticating = true;
        state.authError = null;
      })
      .addCase(signUp.fulfilled, (state, { payload }) => {
        state.isAuthenticating = false;
        state.account = payload;
      })
      .addCase(signUp.rejected, (state, { payload }) => {
        state.isAuthenticating = false;
        state.authError = payload as string;
      })
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.isAuthenticating = true;
        state.authError = null;
      })
      .addCase(signIn.fulfilled, (state, { payload }) => {
        state.isAuthenticating = false;
        state.account = payload;
      })
      .addCase(signIn.rejected, (state, { payload }) => {
        state.isAuthenticating = false;
        state.authError = payload as string;
      })
      // Sign Out
      .addCase(signOut.fulfilled, (state) => {
        state.account = null;
        state.isAuthenticating = false;
      });
  },
});

export const { resetAuthError } = authSlice.actions;
export default authSlice.reducer;

