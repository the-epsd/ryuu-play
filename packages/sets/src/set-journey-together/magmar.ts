import { StoreLike, State, Effect, AddSpecialConditionsEffect, AttackEffect, CardType, CoinFlipPrompt, GameMessage, PokemonCard, SpecialCondition, Stage } from '@ptcg/common';

export class Magmar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 80;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Searing Flame',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: 30,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Burned.'
    }
  ];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Magmar';
  public fullName: string = 'Magmar JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
          return store.reduceEffect(state, specialCondition);
        }
      });
    }

    return state;
  }

}