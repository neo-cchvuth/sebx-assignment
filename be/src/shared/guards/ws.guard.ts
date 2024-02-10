import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const user = await this.authService.validateUserByToken(
        client.handshake?.headers.authorization,
      );

      if (!user) {
        client.disconnect();
        return false;
      }

      context.switchToHttp().getRequest().user = user;
      return true;
    } catch (err) {
      throw new WsException(err.message);
    }
  }
}
