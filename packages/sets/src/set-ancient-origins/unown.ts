import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, Effect, PowerEffect, StateUtils, PokemonCardList, GameError, GameMessage } from '@ptcg/common';

export class Unown extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Farewell Letter',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokemon is ' +
      'on your Bench, you may discard this Pokemon and all cards attached ' +
      'to it (this does not count as a Knock Out). If you do, draw a card.'
  }];

  public attacks = [
    {
      name: 'Hidden Power',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'AOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '30';

  public name: string = 'Unown';

  public fullName: string = 'Unown AOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);

      // check if UnownR is on player's Bench
      const benchIndex = player.bench.indexOf(cardList as PokemonCardList);
      if (benchIndex === -1) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.bench[benchIndex].moveTo(player.discard);
      player.bench[benchIndex].clearEffects();
      player.deck.moveTo(player.hand, 1);
      return state;
    }

    return state;
  }

}
