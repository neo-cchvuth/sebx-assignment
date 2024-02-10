import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../user/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      return {
        username: user.username,
        id: user.id,
      };
    }
    return null;
  }

  async validateUserByToken(authorization: string) {
    const token = authorization.split(' ').pop();
    const payload = await this.jwtService.decode(token);
    const user = { username: payload.username, id: payload.sub };
    return payload ? user : null;
  }

  async login(user: UserDocument) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
