import jwt from 'jsonwebtoken'
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {
  // DI
  static generateToken = (payload: any, duration: number | `${number}${'s' | 'm' | 'h' | 'd'}` = '2h') => {
    return new Promise((resolve) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);
        resolve(token);
      });
    })
  }

  static valdidateToken = (token: string) => {
    throw new Error('Not implemented');
    // return;
  }
}