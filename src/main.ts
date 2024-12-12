import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TelegramService } from './modules/telegram/telegram.service';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  await app.listen(process.env.PORT || 3000, async () => {
    const telegramService = app.get(TelegramService);
    await telegramService.main();
  });
}
bootstrap();
