import { Card } from 'cardgames';

export enum Events {
  CONNECT = 'connect',
  RECONNECT = 'reconnect',
  ROOM_ID = 'room_id',
  PLAYERS_STATE = 'players_state',
  TURN_PLAYER_ID = 'turn_player_id',
  WINNERS = 'winners',
  EXCEPTION = 'exception',
  DISCONNECT = 'disconnect',
  QUEUE = 'queue',
  SKIP = 'skip',
  DRAW_CARD = 'draw_card',
}

export enum MatchmakingState {
  DISCONNECTED = 'disconnected',
  IDLE = 'idle',
  IN_QUEUE = 'in_queue',
  IN_GAME = 'in_game',
}

export interface PlayerState {
  playerId: string;
  playerUsername: string;
  cardsCount: number;
  cards?: Card[];
}

export interface WinnersResponse {
  point: number;
  playerIds: string[];
  breakdown: Record<string, number>;
}

export interface IdResponse {
  id: string;
}

export type PlayersState = Record<string, PlayerState>;
