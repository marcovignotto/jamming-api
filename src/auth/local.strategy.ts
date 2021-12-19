import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(
    email?: string,
    password?: string,
    token?: string,
  ): Promise<any> {
    console.log('token', token);

    const getUserToken = await this.authService.validateAndGetToken(
      email,
      password,
    );

    if (!getUserToken) {
      throw new UnauthorizedException();
    }
    return getUserToken;
  }
}
