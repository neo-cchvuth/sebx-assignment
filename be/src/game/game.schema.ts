import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DeckOfCards } from 'cardgames';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Player, Winners } from '../shared/models/game';

export type GameRoomDocument = HydratedDocument<GameRoom>;

@Schema()
export class GameRoom {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: string;

  @Prop()
  turnPlayerId: string;

  @Prop({ type: SchemaTypes.Mixed })
  winners: Winners;

  @Prop({ required: true, type: SchemaTypes.Mixed })
  players: Record<string, Player>;

  @Prop({ required: true, type: SchemaTypes.Mixed })
  remainingCards: DeckOfCards;
}

export const GameRoomSchema = SchemaFactory.createForClass(GameRoom);
