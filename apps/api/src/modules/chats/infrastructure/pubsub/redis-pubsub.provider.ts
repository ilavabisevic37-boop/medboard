import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

/**
 * Apollo pub/sub engine backed by Redis. Subscriptions need TWO dedicated
 * connections (a subscribed Redis connection can't run regular commands) —
 * do NOT reuse RedisService's client here.
 */
export const CHAT_PUB_SUB = Symbol('ChatPubSub');

export const redisPubSubProvider: Provider = {
  provide: CHAT_PUB_SUB,
  inject: [ConfigService],
  useFactory: (config: ConfigService): RedisPubSub => {
    const url = config.get<string>('REDIS_URL') ?? 'redis://localhost:6379';
    const options = { maxRetriesPerRequest: 3 } as const;
    return new RedisPubSub({
      publisher: new Redis(url, options),
      subscriber: new Redis(url, options),
    });
  },
};
