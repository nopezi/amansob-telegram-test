import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './modules/telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';
import { PokemonModule } from './modules/pokemon/pokemon.module';

@Module({
  imports: [TelegramModule, ConfigModule.forRoot({ isGlobal: true }), PokemonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
