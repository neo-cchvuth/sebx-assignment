import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { AuthModule } from '../auth/auth.module';
import { MatchmakingService } from './matchmaking.service';
import { GameService } from './game.service';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GameRoom, GameRoomSchema } from './game.schema';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forFeature([
      { name: GameRoom.name, schema: GameRoomSchema },
    ]),
  ],
  providers: [GameGateway, MatchmakingService, GameService],
  exports: [MongooseModule, GameGateway, MatchmakingService, GameService],
})
export class GameModule {}
