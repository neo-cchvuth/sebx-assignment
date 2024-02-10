import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { AppModule } from '../app.module';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';

describe('AuthController', () => {
  let authController: AuthController;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule, AuthModule, UserModule, PassportModule],
      controllers: [AuthController],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('root', () => {
    it('should return auth', async () => {
      const user = {
        id: '1',
        username: 'test',
      };
      const result = await authController.login({
        user,
      });
      expect(result.access_token).toBeTruthy();
    });
  });
});
