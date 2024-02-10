import { ConsoleLogger, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private log: ConsoleLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    this.log.log(req.originalUrl);

    if (next) {
      next();
    }
  }
}
