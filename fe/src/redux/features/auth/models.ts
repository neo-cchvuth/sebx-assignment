import { AsyncStatus } from '@/redux/utils/reducers';

export type AuthState = {} & AsyncStatus;

export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
};
