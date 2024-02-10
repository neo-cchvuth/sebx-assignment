import { configureStore } from '@reduxjs/toolkit';

import authReducer from './features/auth';
import playerReducer from './features/player';

export const makeStore = () => {
  return configureStore({
    reducer: {
      authReducer,
      playerReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
