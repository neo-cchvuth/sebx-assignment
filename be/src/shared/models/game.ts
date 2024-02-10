import { Card } from 'cardgames';

export interface Player {
  playerId: string;
  socketId: string;
  cards: Card[];
}

export interface Winners {
  point: number;
  playerIds: string[];
  breakdown: Record<string, number>;
}

export interface ClientPlayerState {
  playerId: string;
  playerUsername: string;
  cardsCount: number;
  cards?: Card[];
}
