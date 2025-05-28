import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from '../users/services/user.service';

import { Request, Response, NextFunction } from 'express';
import { User } from '../users/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User | null;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.userService.findOne(userId);
      req.currentUser = user;
    }
    next();
  }
}
