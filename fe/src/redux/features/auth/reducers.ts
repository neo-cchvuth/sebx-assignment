import { addCaseToBuilderForStatus } from '@/redux/utils/reducers';
import { removeToken, storeToken } from '@/redux/utils/token';
import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { setPlayer } from '../player';
import { AuthState, LoginPayload, LoginResponse } from './models';

const reducers = {};

const postLogin = createAsyncThunk(
  'auth/login',
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>('/auth/login', data);
      storeToken(response.data.access_token);
      axios.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.access_token}`;
      return response.data;
    } catch (e: any) {
      console.error(e);
      return rejectWithValue(e.response.data);
    }
  },
);

const postLogout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  removeToken();
  dispatch(setPlayer({}));
  return true;
});

const extraReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
  addCaseToBuilderForStatus(builder, postLogin, (state) => {
    state.error = undefined;
  });
  addCaseToBuilderForStatus(builder, postLogout);
};

export { reducers, extraReducers, postLogin, postLogout };
