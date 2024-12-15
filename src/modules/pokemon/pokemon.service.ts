import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PokemonService {
  async getList(
    client: any,
    message: any,
    messageSended: boolean,
  ): Promise<any> {
    const sender = await message.getSender();
    let result: boolean = false;
    try {
      const pesanPecah = message?.text?.split(' ');
      if (
        !messageSended &&
        pesanPecah.length > 1 &&
        pesanPecah[0] == 'pokemon'
      ) {
        await axios({
          method: 'get',
          url:
            process.env.API_POKEMON + `pokemon?limit=${pesanPecah[1]}&offset=0`,
        })
          .then(async (response) => {
            const pesan = `**This list of pokemon**\n`;

            await client.sendMessage(sender, {
              message: `${pesan}`,
            });

            for (const listPokemon of response?.data?.results) {
              console.log(
                '🚀 ~ PokemonService ~ .then ~ listPokemon?.name:',
                listPokemon?.name,
              );
              await this.getDetail(
                client,
                {
                  text: listPokemon?.name,
                },
                false,
              );
            }

            messageSended = true;
          })
          .catch(() => {
            messageSended = false;
          });
      }

      return messageSended;
    } catch (error) {
      await client.sendMessage(sender, {
        message: `${error}`,
      });
      result = true;
      return result;
    }
  }

  async getDetail(
    client: any,
    message: any,
    messageSended: boolean,
  ): Promise<any> {
    console.log('🚀 ~ PokemonService ~ getDetail:', message);
    const sender = await message.getSender();
    let result: boolean = false;
    try {
      if (!messageSended) {
        let pesan: string;
        await axios({
          method: 'get',
          url: process.env.API_POKEMON + `pokemon/${message?.text}`,
        })
          .then(async (response) => {
            pesan = `**Pokemon Name** : ${response?.data?.forms[0].name} \n`;
            for (const stat of response?.data?.stats) {
              pesan += `**${stat?.stat.name}** : ${stat?.base_stat} \n`;
            }
            for (const type of response?.data?.types) {
              pesan += `**${type?.type.name}** : ${type?.slot} \n`;
            }
            // abilities
            for (const ab of response?.data?.abilities) {
              pesan += `**${ab?.ability.name}** : ${ab?.slot} \n`;
            }
            pesan += `**Weight** : ${response?.data?.weight} \n`;

            const foto = response?.data?.sprites?.other?.home?.front_default;
            await client.sendFile(message.sender, {
              file: foto,
              caption: pesan,
            });

            messageSended = true;
          })
          .catch(() => {
            messageSended = false;
          });
      }

      return messageSended;
    } catch (error) {
      await client.sendMessage(sender, {
        message: `${error}`,
      });
      result = true;
      return result;
    }
  }

  async getByAbility(
    client: any,
    message: any,
    messageSended: boolean,
  ): Promise<any> {
    const sender = await message.getSender();
    let result: boolean = false;
    try {
      if (!messageSended) {
        let pesan: string;
        await axios({
          method: 'get',
          url: process.env.API_POKEMON + `ability/${message?.text}`,
        })
          .then(async (response) => {
            pesan = `**Pokemon With Ability** : ${response?.data?.name} \n\n`;
            pesan += `**Effect** 
              ${
                response?.data?.effect_entries.length > 1
                  ? response?.data?.effect_entries[1].effect
                  : response?.data?.effect_entries[0].effect
              } \n`;
            pesan += `**Short Effect** 
              ${
                response?.data?.effect_entries.length > 1
                  ? response?.data?.effect_entries[1].short_effect
                  : response?.data?.effect_entries[0].short_effect
              } \n`;

            for (const stat of response?.data?.pokemon) {
              pesan += `**${stat?.pokemon.name}** \n`;
            }

            await client.sendMessage(sender, {
              message: `${pesan}`,
            });

            messageSended = true;
          })
          .catch(() => {
            messageSended = false;
          });
      }

      return messageSended;
    } catch (error) {
      await client.sendMessage(sender, {
        message: `${error}`,
      });
      result = true;
      return result;
    }
  }

  async getByType(
    client: any,
    message: any,
    messageSended: boolean,
  ): Promise<any> {
    const sender = await message.getSender();
    let result: boolean = false;
    try {
      if (!messageSended) {
        let pesan: string;
        await axios({
          method: 'get',
          url: process.env.API_POKEMON + `type/${message?.text}`,
        })
          .then(async (response) => {
            pesan = `**Pokemon With Type** : ${response?.data?.name} \n\n`;

            for (const stat of response?.data?.pokemon) {
              pesan += `**${stat?.pokemon.name}** \n`;
            }

            await client.sendMessage(sender, {
              message: `${pesan}`,
            });

            messageSended = true;
          })
          .catch(() => {
            messageSended = false;
          });
      }

      return messageSended;
    } catch (error) {
      await client.sendMessage(sender, {
        message: `${error}`,
      });
      result = true;
      return result;
    }
  }

  async getByStat(
    client: any,
    message: any,
    messageSended: boolean,
  ): Promise<any> {
    const sender = await message.getSender();
    let result: boolean = false;
    try {
      if (!messageSended) {
        let pesan: string;
        await axios({
          method: 'get',
          url: process.env.API_POKEMON + `stat/${message?.text}`,
        })
          .then(async (response) => {
            pesan = `**Pokemon With Stat** : ${response?.data?.name} \n\n`;

            pesan += `**Move Damage Type** : ${response?.data?.move_damage_class?.name} \n`;

            await client.sendMessage(sender, {
              message: `${pesan}`,
            });

            messageSended = true;
          })
          .catch(() => {
            messageSended = false;
          });
      }

      return messageSended;
    } catch (error) {
      await client.sendMessage(sender, {
        message: `${error}`,
      });
      result = true;
      return result;
    }
  }
}
