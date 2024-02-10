import { addCaseToBuilderForStatus } from '@/redux/utils/reducers';
import {
  ActionReducerMapBuilder,
  CaseReducer,
  PayloadAction,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import axios from 'axios';

import { postLogout } from '../auth/reducers';
import { PlayerResponse, PlayerState } from './models';

const setPlayer: CaseReducer<PlayerState, PayloadAction<PlayerState>> = (
  state,
  action,
) => {
  return {
    ...state,
    ...action.payload,
  };
};

const reducers = {
  setPlayer,
};

const getPlayer = createAsyncThunk('player/me', async (_, { dispatch }) => {
  try {
    const response = await axios.get<PlayerResponse>('/user');
    return response.data;
  } catch (e) {
    dispatch(postLogout());
    location.reload();
  }
});

const extraReducers = (builder: ActionReducerMapBuilder<PlayerState>) => {
  addCaseToBuilderForStatus(builder, getPlayer, (state, action) => {
    state.player = action.payload;
  });
};

export { reducers, extraReducers, getPlayer };
