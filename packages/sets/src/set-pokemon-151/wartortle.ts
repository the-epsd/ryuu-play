import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, ChooseCardsPrompt, GameMessage } from "@ptcg/common";

export class Wartortle extends PokemonCard {

  public regulationMark = 'G';

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Squirtle';

  public cardType = CardType.WATER;

  public hp = 100;

  public weakness = [{ type: CardType.LIGHTNING, }];

  retreat = [CardType.COLORLESS, CardType.COLORLESS];
  attacks = [
    {
      name: 'Free Diving',
      cost: [CardType.WATER],
      damage: 0,
      text: 'Put up to 3 Water Energy cards from your discard pile into your hand.'
    },
    {
      name: 'Spinning Attack',
      cost: [CardType.WATER, CardType.WATER],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '8';

  public name: string = 'Wartortle';

  public fullName: string = 'Wartortle MEW';

  reduceEffect(store: StoreLike, state: State, effect: Effect) {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const prompt = new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        {
          cardType: CardType.WATER
        },
        {
          min: 0,
          max: 3
        }
      );
      state = store.prompt(state, prompt, chosenCards => {
        player.discard.moveCardsTo(chosenCards, player.hand);
      });
    }
    return state;
  }
}