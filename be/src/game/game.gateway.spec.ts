import { Test, TestingModule } from '@nestjs/testing';

import { GameGateway } from './game.gateway';
import { GameModule } from './game.module';
import { AppModule } from '../app.module';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';

describe('GameGateway', () => {
  let gameGateway: GameGateway;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule, AuthModule, GameModule, UserModule, PassportModule],
    }).compile();

    gameGateway = app.get<GameGateway>(GameGateway);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('root', () => {
    it('should handle connection', async () => {
      const mockClient: any = {
        handshake: {
          headers: {
            authorization: 'Bearer abc',
          },
        },
        data: {},
      };
      const expected: any = {
        username: 'abc',
        sub: '1',
      };
      jest
        .spyOn(gameGateway['authService']['jwtService'], 'decode')
        .mockReturnValueOnce(expected);
      await gameGateway.handleConnection(mockClient);
      expect(mockClient.data.id).toBe(expected.sub);
    });

    it('should handle add queue and disconnection', async () => {
      gameGateway.queue({
        id: '1',
      });
      expect(gameGateway['matchmakingService']['queue'].size).toBe(1);
      await gameGateway.handleDisconnect({ id: '1' } as any);
      expect(gameGateway['matchmakingService']['queue'].size).toBe(0);
    });
  });
});
