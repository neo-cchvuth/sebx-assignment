import { Injectable } from '@nestjs/common';
import { Card, DeckOfCards } from 'cardgames';
import { ClientPlayerState, Winners } from '../shared/models/game';
import { UserService } from '../user/user.service';
import { Server, Socket } from 'socket.io';
import { GameRoom, GameRoomDocument } from './game.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Events, Status } from '../shared/models/status';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(GameRoom.name) private gameRoomModel: Model<GameRoom>,
    private userService: UserService,
  ) {}

  async findRoom(roomId: string) {
    return this.gameRoomModel.findById(roomId).exec();
  }

  async createRoom(newRoom: Partial<GameRoom>) {
    const createdRoom = new this.gameRoomModel(newRoom);
    return createdRoom.save();
  }

  async checkPlayerReconnect(userId: string) {
    return this.gameRoomModel.findOne({
      [`players.${userId}.playerId`]: `${userId}`,
    });
  }

  async newGame(playerSockets: Socket[]) {
    const playerIds = playerSockets.map((socket) => socket.data.id);
    const newRoom: Partial<GameRoom> = {
      turnPlayerId: playerIds[0],
      players: playerIds.reduce((allIds, id, index) => {
        allIds[id] = {
          playerId: id,
          socketId: playerSockets[index].id,
          cards: [],
        };
        return allIds;
      }, {}),
      remainingCards: null,
    };
    this.distributeCardsToRoom(newRoom);
    return this.createRoom(newRoom);
  }

  async processTurn(server: Server, client: Socket, drawCard = false) {
    try {
      const room = await this.updateRoomState(client, drawCard);
      this.notifyPlayers(server, room);
      return {
        status: Status.SUCCESS,
      };
    } catch (e) {
      console.error(e);
      return {
        status: Status.FAIL,
        error: e,
      };
    }
  }

  notifyPlayers(server: Server, room: GameRoomDocument, emitRoom = false) {
    if (emitRoom) {
      server.to(room.id).emit(Events.ROOM_ID, {
        id: room.id,
      });
    }
    server.to(room.id).emit(Events.TURN_PLAYER_ID, {
      id: room.turnPlayerId,
    });
    Object.keys(room.players).forEach((id) => {
      const socketId = room.players[id].socketId;
      this.getStateForPlayer(room, id).then((opponentsState) => {
        server.sockets.sockets
          .get(socketId)
          ?.emit(Events.PLAYERS_STATE, opponentsState);
      });
    });

    if (room.winners) {
      server.to(room.id).emit(Events.WINNERS, room.winners);
      room.deleteOne().exec();
    }
  }

  private async updateRoomState(client: Socket, drawCard = false) {
    const roomId = Array.from(client.rooms).pop();
    if (!roomId) throw 'no_room';

    const room = await this.findRoom(roomId);
    const playerId = client.data.id;

    if (room.turnPlayerId !== playerId) throw 'wait_for_turn';

    if (drawCard) {
      const { players, remainingCards } = room.toJSON();
      const deckOfCards = new DeckOfCards(remainingCards.numberOfCards);
      deckOfCards.deck = remainingCards.deck;
      const drawnCard = deckOfCards.drawCard() as Card;
      players[playerId].cards.push(drawnCard);
      room.remainingCards = deckOfCards;
      room.players = players;
    }

    await this.nextTurn(room);
    room.save();
    return room;
  }

  private async getStateForPlayer(
    room: GameRoom,
    playerId: string,
  ): Promise<Record<string, ClientPlayerState>> {
    const playerIds = Object.keys(room.players);
    const users = await Promise.all(
      playerIds.map((id) => this.userService.findOneById(id)),
    );
    return playerIds.reduce((acc, id, i) => {
      acc[id] = {
        cardsCount: room.players[id].cards.length,
        cards:
          room.winners || playerId === id ? room.players[id].cards : undefined,
        playerId: id,
        playerUsername: users[i].username,
      };
      return acc;
    }, {});
  }

  private async nextTurn(room: GameRoom): Promise<void> {
    const allPlayerIds = Object.keys(room.players);
    const currentIndex = allPlayerIds.findIndex(
      (id) => id === room.turnPlayerId,
    );

    if (currentIndex !== -1 && allPlayerIds[currentIndex + 1]) {
      room.turnPlayerId = allPlayerIds[currentIndex + 1];
    } else {
      await this.conclude(room);
    }
  }

  private async conclude(room: GameRoom): Promise<void> {
    room.turnPlayerId = null;
    const winners: Winners = {
      point: 0,
      playerIds: [],
      breakdown: {},
    };

    Object.keys(room.players).forEach((playerId) => {
      const total = this.calculatePoint(room.players[playerId].cards);

      if (total > winners.point) {
        winners.point = total;
        winners.playerIds = [playerId];
      } else if (total === winners.point) {
        winners.playerIds.push(playerId);
      }

      winners.breakdown[playerId] = total;
    });
    room.winners = winners;
  }

  private calculatePoint(cards: Card[]) {
    return (
      cards.reduce((total, card) => {
        const point = card.rank === 'A' ? 1 : Number(card.rank);
        if (isFinite(point)) {
          total += point;
        }
        return total;
      }, 0) % 10
    );
  }

  private distributeCardsToRoom(room: Partial<GameRoom>): void {
    const deck = new DeckOfCards(52);
    deck.shuffleDeck();
    const playerIds = Object.keys(room.players);
    for (let i = 0; i < 2; i++) {
      playerIds.forEach((id) => {
        room.players[id].cards.push(deck.drawCard() as Card);
      });
    }
    room.remainingCards = deck;
  }
}
