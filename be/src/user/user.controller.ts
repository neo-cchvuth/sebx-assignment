import {
  Controller,
  Request,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getProfile(@Request() req) {
    const id = req.user.id;
    const user = await this.userService.findOneById(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      username: user.username,
    };
  }
}
