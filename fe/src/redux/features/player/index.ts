import { createSlice } from '@reduxjs/toolkit';

import { PlayerState } from './models';
import { extraReducers, reducers } from './reducers';

const initialState: PlayerState = {};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers,
  extraReducers,
});

export const { setPlayer } = playerSlice.actions;
export default playerSlice.reducer;
