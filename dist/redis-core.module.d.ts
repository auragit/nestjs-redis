import { DynamicModule, OnModuleDestroy } from '@nestjs/common';
import { RedisClient } from './redis-client.provider';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';
export declare class RedisCoreModule implements OnModuleDestroy {
    private readonly options;
    private readonly redisClient;
    constructor(options: RedisModuleOptions | RedisModuleOptions[], redisClient: RedisClient);
    static register(options: RedisModuleOptions | RedisModuleOptions[]): DynamicModule;
    static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule;
    onModuleDestroy(): void;
}
