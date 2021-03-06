/**
 * @desc strategy to validate user/pass and return a token
 */

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const getUserToken = await this.authService.validateUser(email, password);
    if (!getUserToken) {
      throw new UnauthorizedException();
    }
    return getUserToken;
  }
}
