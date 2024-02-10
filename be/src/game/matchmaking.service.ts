import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { GameService } from './game.service';
import { NonDupFIFO } from '../shared/models/fifo';

@Injectable()
export class MatchmakingService {
  private queue = new NonDupFIFO<string>();
  private matchmakingInProgress = false;
  private readonly poolSize = Number(process.env.POOL_SIZE || 4);

  constructor(private gameService: GameService) {}

  add(socketId: string, server: Server) {
    this.queue.queue(socketId);
    setTimeout(() => {
      this.matchmake(server);
    });
  }

  dequeue(socketId: string) {
    this.queue.remove(socketId);
  }

  private matchmake(server: Server) {
    if (this.matchmakingInProgress || this.queue.size < this.poolSize) return;
    this.matchmakingInProgress = true;
    const pooledSocketIds = [];
    while (this.queue.size > 0) {
      pooledSocketIds.push(this.queue.dequeue());
      if (pooledSocketIds.length === this.poolSize) {
        this.initiateGame(server, pooledSocketIds);
      }
    }
    this.matchmakingInProgress = false;
  }

  private async initiateGame(server: Server, pooledSocketIds: string[]) {
    const pooledSockets = pooledSocketIds.map((socketId) =>
      server.sockets.sockets.get(socketId),
    );
    const room = await this.gameService.newGame(pooledSockets);
    pooledSockets.forEach((socket) => {
      socket.join(room.id);
    });
    this.gameService.notifyPlayers(server, room, true);
  }
}
