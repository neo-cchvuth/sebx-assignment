import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModule } from './user.module';
import { AppModule } from '../app.module';

describe('UserController', () => {
  let userController: UserController;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule, UserModule],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('root', () => {
    it('should return user', async () => {
      const expected = {
        id: '1',
        username: 'test',
      };
      jest
        .spyOn(userController['userService'], 'findOneById')
        .mockResolvedValueOnce(expected as any);
      const result = await userController.getProfile({
        user: { id: expected.id },
      });
      expect(result).toEqual(expected);
    });
  });
});
