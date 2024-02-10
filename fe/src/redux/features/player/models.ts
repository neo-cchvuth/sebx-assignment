import { AsyncStatus } from '@/redux/utils/reducers';

export type Player = {
  id: string;
  username: string;
};

export type PlayerState = {
  player?: Player;
} & AsyncStatus;

export type PlayerResponse = Player;
