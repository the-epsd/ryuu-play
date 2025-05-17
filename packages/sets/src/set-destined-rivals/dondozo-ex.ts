import { PokemonCard, CardTag, Stage, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, ConfirmPrompt, GameMessage, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF } from "@ptcg/common";

export class Dondozoex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public regulationMark = 'I';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 260;
  public weakness = [{ type: L }];
  public retreat = [ C, C, C, C ];

  public attacks = [
    {
      name: 'Tsunami Reversal',
      cost: [W, C],
      damage: 30,
      damageCalculation: '+',
      text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
    },
    {
      name: 'Dynamic Dive',
      cost: [W, W, C, C],
      damage: 120,
      damageCalculation: '+',
      text: 'You may do 120 more damage. If you do, this Pokémon also does 50 damage to itself.'
    },
    
  ];

  public set: string = 'SV9a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Dondozo ex';
  public fullName: string = 'Dondozo ex SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tsunami Reversal
    if (WAS_ATTACK_USED(effect, 0, this)){
      effect.damage += effect.player.active.damage;
    }

    // Dynamic Dive
    if (WAS_ATTACK_USED(effect, 1, this)){
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          effect.damage += 120;
          
          THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 50);
        }
      });
    }
    
    return state;
  }
}