import {
  DynamicModule,
  Global, Inject, Module, OnModuleDestroy
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  createAsyncClientOptions,
  createClient,
  RedisClient
} from './redis-client.provider';
import { REDIS_CLIENT, REDIS_MODULE_OPTIONS } from './redis.constants';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';
import { RedisService } from './redis.service';


@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
  imports: [ConfigModule],
})
export class RedisCoreModule implements OnModuleDestroy {
  constructor(
    @Inject(REDIS_MODULE_OPTIONS)
    private readonly options: RedisModuleOptions | RedisModuleOptions[],
    @Inject(REDIS_CLIENT)
    private readonly redisClient: RedisClient,
  ) {}

  static register(
    options: RedisModuleOptions | RedisModuleOptions[],
  ): DynamicModule {
    return {
      module: RedisCoreModule,
      providers: [
        createClient(),
        { provide: REDIS_MODULE_OPTIONS, useValue: options },
      ],
      exports: [RedisService],
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisCoreModule,
      imports: options.imports,
      providers: [createClient(), createAsyncClientOptions(options)],
      exports: [RedisService],
    };
  }

  onModuleDestroy() {
    const closeConnection = ({ clients, defaultKey }) => (options) => {
      const name = options.name || defaultKey;
      const client = clients.get(name);

      if (client && !options.keepAlive) {
        client.disconnect();
      }
    };

    const closeClientConnection = closeConnection(this.redisClient);

    if (Array.isArray(this.options)) {
      this.options.forEach(closeClientConnection);
    } else {
      closeClientConnection(this.options);
    }
  }
}
