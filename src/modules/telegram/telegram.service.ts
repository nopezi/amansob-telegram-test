import { Injectable } from '@nestjs/common';
import { Api, TelegramClient } from 'telegram';
import { NewMessage } from 'telegram/events';
import { StringSession } from 'telegram/sessions';
import { PokemonService } from '../pokemon/pokemon.service';

@Injectable()
export class TelegramService {
  constructor(private readonly pokemonService: PokemonService) {}

  async main(): Promise<void> {
    try {
      const stringSession = new StringSession(process.env.TELEGRAM_API_SESSION);
      const client = new TelegramClient(
        stringSession,
        parseInt(process.env.TELEGRAM_API_ID),
        process.env.TELEGRAM_API_HASH,
        { connectionRetries: 10 },
      );
      await client.start({
        botAuthToken: process.env.TELEGRAM_API_TOKEN,
      });
      // client.setParseMode('md');

      console.log(client.session.save());
      // client.session.save();
      // stringSession.save();

      client.addEventHandler(async (events) => {
        // await events.message.buttons?.[0]?.[0].click({});
        // console.log(
        //   '🚀 ~ TelegramService ~ client.addEventHandler ~ await events.message.buttons?.[0]?.[0].click({}):',
        //   await events.message.buttons?.[0]?.[0].click({
        //     sharePhone: 'masok',
        //   }),
        // );
        // console.log(
        //   '🚀 ~ TelegramService ~ client.addEventHandler ~ events:',
        //   events,
        // );
        const message = events.message;
        // await client.invoke(
        //   new Api.messages.SetTyping({
        //     peer: await message.getSender(),
        //     action: new Api.SendMessageTypingAction(),
        //     topMsgId: 430,
        //   }),
        // );
        // client.sendMessage(await message.getSender(), {
        //   message: 'coba tombol',
        //   buttons: client.buildReplyMarkup([
        //     // Button.inline('pikachu',),
        //     Button.inline('owen'),
        //   ]),
        // });
        // await client.invoke(
        //   new Api.bots.SetBotMenuButton({
        //     userId: await message.getSender(),
        //     button: new Api.BotMenuButtonDefault(),
        //   }),
        // );

        if (events.isPrivate) {
          let messageSended: boolean;
          messageSended = await this.start(client, message, messageSended);
          messageSended = await this.pokemonService.getDetail(
            client,
            message,
            messageSended,
          );
          messageSended = await this.pokemonService.getByAbility(
            client,
            message,
            messageSended,
          );
          messageSended = await this.pokemonService.getByType(
            client,
            message,
            messageSended,
          );
          await this.notFound(client, message, messageSended);
        }
      }, new NewMessage({}));

      const terimaTombol = await client.invoke(
        new Api.bots.GetBotMenuButton({
          userId: 'rumahsakit_bot',
        }),
      );
      console.log(
        '🚀 ~ TelegramService ~ client.addEventHandler ~ terimaTombol:',
        terimaTombol,
      );
    } catch (error) {
      throw error;
    }
  }

  async start(client: any, message: any, messageSended: boolean): Promise<any> {
    try {
      let result: boolean = false;
      if (!messageSended && message?.text.toLowerCase() == '/start') {
        const sender = await message.getSender();
        await client.sendMessage(sender, {
          message: `hi your id is ${message.senderId}`,
        });
        result = true;
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async notFound(
    client: any,
    message: any,
    messageSended: boolean,
  ): Promise<any> {
    try {
      let result: boolean = false;
      if (!messageSended) {
        const sender = await message.getSender();
        await client.sendMessage(sender, {
          message: `sorry, We didn't find the data you were looking for`,
        });
        result = true;
      }

      return result;
    } catch (error) {
      throw error;
    }
  }
}
