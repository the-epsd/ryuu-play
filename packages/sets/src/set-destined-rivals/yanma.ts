import { PokemonCard, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, GameError, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType } from "@ptcg/common";

export class Yanma extends PokemonCard {
  public regulationMark = 'I';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Whirlwind',
      cost: [ C ],
      damage: 0,
      text: 'Switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
    },
    {
      name: 'Razor Wing',
      cost: [ G, C ],
      damage: 30,
      text: ''
    },
    
  ];

  public set: string = 'SV9a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Yanma';
  public fullName: string = 'Yanma SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Whirlwind
    if (WAS_ATTACK_USED(effect, 0, this)){
      const opponent = effect.opponent;
      // Check if opponent has any benched Pokemon
      if (!opponent.bench.some(b => b.cards.length > 0)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        opponent.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (targets && targets.length > 0) {
          opponent.active.clearEffects();
          opponent.switchPokemon(targets[0]);
          return state;
        }
      });
    }
    
    return state;
  }
}