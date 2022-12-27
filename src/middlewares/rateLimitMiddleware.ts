import { TooManyRequests } from '@src/errors/TooManyRequests';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

export const rateLimitHandler: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: () => {
    const tooManyRequests = new TooManyRequests(
      'Too many requests, please try again later'
    );

    return {
      status: tooManyRequests.status,
      name: tooManyRequests.name,
      message: tooManyRequests.message
    };
  }
});
