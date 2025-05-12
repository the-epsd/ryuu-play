import { PokemonCard, Stage, CardType, CardTag, PowerType, StoreLike, State, Effect, WAS_ATTACK_USED, COIN_FLIP_PROMPT, DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '@ptcg/common';

export class ArceusFire extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C];
  public tags = [CardTag.ARCEUS];

  public powers = [{
    name: 'Arceus Rule',
    powerType: PowerType.ARCEUS_RULE,
    text: 'You may have as many of this card in your deck as you like.'
  }];

  public attacks = [
    {
      name: 'Bright FLame',
      cost: [R, C, C],
      damage: 80,
      text: 'Flip a coin. If tails, discard 2 Energy attached to Arceus.'
    }
  ];

  public set: string = 'AR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'AR3';
  public name: string = 'Arceus';
  public fullName: string = 'Arceus Fire AR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Bright Flame
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
        }
      });
    }

    return state;
  }
}