import { createSlice } from '@reduxjs/toolkit';

import { AuthState } from './models';
import { extraReducers, reducers } from './reducers';

const initialState: AuthState = {};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers,
  extraReducers,
});

export const {} = authSlice.actions;
export default authSlice.reducer;
