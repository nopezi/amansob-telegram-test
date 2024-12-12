import { Controller } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

@Controller()
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}
}
