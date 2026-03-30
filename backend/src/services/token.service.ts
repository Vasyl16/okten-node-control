import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';

import { config } from '../configs/config';
import { UnauthorizedError } from '../errors/errors';
import type { TokenPair, TokenPayload } from '../types/token.type';

class TokenService {
  generateToken = (payload: TokenPayload) => {
    const accessToken = jwt.sign(payload, config.token.accessToken as string, {
      expiresIn: config.token.accessTokenExp as StringValue,
      algorithm: 'HS256',
    });
    const refreshToken = jwt.sign(
      payload,
      config.token.refreshToken as string,
      {
        expiresIn: config.token.refreshTokenExp as StringValue,
        algorithm: 'HS256',
      }
    );

    return { accessToken, refreshToken } as TokenPair;
  };

  verifyToken = (token: string, type: 'accessToken' | 'refreshToken') => {
    let secret: string;

    if (type === 'accessToken') {
      secret = config.token.accessToken as string;
    } else {
      secret = config.token.refreshToken as string;
    }

    try {
      return jwt.verify(token, secret) as TokenPayload;
    } catch (_) {
      throw new UnauthorizedError('Token is invalid');
    }
  };
}

export const tokenService = new TokenService();
