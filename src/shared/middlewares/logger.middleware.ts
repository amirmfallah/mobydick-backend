import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      '%s-%s-%s-%s',
      req.method,
      req.path,
      JSON.stringify(req.query),
      JSON.stringify(req.body),
    );
    next();
  }
}
