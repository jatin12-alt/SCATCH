import { createSlice } from '@reduxjs/toolkit';

const initialToken = typeof window !== 'undefined' ? localStorage.getItem('scatch_token') : null;

const initialState = {
  user: null,
  token: initialToken,
  status: 'idle'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = 'authenticated';
      localStorage.setItem('scatch_token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      localStorage.removeItem('scatch_token');
    },
    setProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    }
  }
});

export const { loginSuccess, logout, setProfile } = authSlice.actions;
export default authSlice.reducer;