import { PokemonCard, Stage, CardType, CardTag, PowerType, StoreLike, State, Effect, WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '@ptcg/common';

export class ArceusLightning extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];
  public tags = [CardTag.ARCEUS];

  public powers = [{
    name: 'Arceus Rule',
    powerType: PowerType.ARCEUS_RULE,
    text: 'You may have as many of this card in your deck as you like.'
  }];

  public attacks = [
    {
      name: 'Lightning Turn',
      cost: [L, C],
      damage: 30,
      text: 'Switch Arceus with 1 of your Benched Pokémon.'
    }
  ];

  public set: string = 'AR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'AR6';
  public name: string = 'Arceus';
  public fullName: string = 'Arceus Lightning AR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Mind Bend
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
    }

    return state;
  }
}