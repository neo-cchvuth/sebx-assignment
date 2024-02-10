import { Request, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../shared/guards/ws.guard';
import { MatchmakingService } from './matchmaking.service';
import { Events, Status } from '../shared/models/status';
import { AuthService } from '../auth/auth.service';
import { Card } from 'cardgames';
import { GameService } from './game.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseGuards(WsJwtGuard)
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private matchmakingService: MatchmakingService,
    private gameService: GameService,
    private authService: AuthService,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const user = await this.authService.validateUserByToken(
      client.handshake.headers.authorization,
    );
    client.data.id = user.id;
    return;
  }

  async handleDisconnect(client: Socket): Promise<{ status: Status }> {
    this.matchmakingService.dequeue(client.id);
    return {
      status: Status.SUCCESS,
    };
  }

  @SubscribeMessage(Events.QUEUE)
  async queue(@Request() req): Promise<{ status: Status }> {
    this.matchmakingService.add(req.id, this.server);
    return {
      status: Status.SUCCESS,
    };
  }

  @SubscribeMessage(Events.RECONNECT)
  async reconnect(
    @ConnectedSocket() client: Socket,
  ): Promise<{ status: Status }> {
    const userId = client.data.id;
    const room = await this.gameService.checkPlayerReconnect(userId);

    if (room) {
      client.join(room.id);
      const players = room.toJSON().players;
      players[userId].socketId = client.id;
      room.players = players;
      room.save();
      this.gameService.notifyPlayers(this.server, room, true);
    }
    return {
      status: Status.SUCCESS,
    };
  }

  @SubscribeMessage(Events.DRAW_CARD)
  async drawCard(
    @ConnectedSocket() client: Socket,
  ): Promise<{ card?: Card; status: Status; error?: string }> {
    return this.gameService.processTurn(this.server, client, true);
  }

  @SubscribeMessage(Events.SKIP)
  async skipTurn(
    @ConnectedSocket() client: Socket,
  ): Promise<{ status: Status; error?: string }> {
    return this.gameService.processTurn(this.server, client);
  }
}
