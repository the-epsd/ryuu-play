import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, GameError, GameMessage, Card, ChooseCardsPrompt, SuperType, ShuffleDeckPrompt } from "@ptcg/common";

export class Eevee extends PokemonCard {

  public regulationMark = 'G';

  public stage = Stage.BASIC;

  public cardType = CardType.COLORLESS;

  public hp = 70;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Colorful Friends',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Search your deck for up to 3 Pokémon of different types, reveal them, and put them into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Skip',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '133';
  public name: string = 'Eevee';
  public fullName: string = 'Eevee MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON } as any,
        { min: 0, max: 3, allowCancel: true, differentTypes: true }
      ), selected => {
        cards = selected || [];


        cards.forEach((card, index) => {
          player.deck.moveCardTo(card, player.hand);
        });
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }
    return state;
  }
}