import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { BetsModule } from './modules/bets/bets.module';
import { SettlementModule } from './modules/settlement/settlement.module';
import { User } from './modules/users/user.entity';
import { MacroEvent } from './modules/events/event.entity';
import { BetOption } from './modules/events/bet-option.entity';
import { Bet } from './modules/bets/bet.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASS', 'postgres'),
        database: config.get<string>('DB_NAME', 'macrobet'),
        entities: [User, MacroEvent, BetOption, Bet],
        synchronize: true, // Should be false in production
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),
    UsersModule,
    EventsModule,
    BetsModule,
    SettlementModule,
  ],
})
export class AppModule { }
