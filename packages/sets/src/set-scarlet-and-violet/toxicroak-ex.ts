import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, GameError, GameMessage, ChooseCardsPrompt, ShuffleDeckPrompt, AddSpecialConditionsEffect, SpecialCondition } from "@ptcg/common";

export class Toxicroakex extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Croagunk';

  public cardType: CardType = CardType.DARK;

  public hp: number = 250;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Nasty Plot',
      cost: [CardType.DARK],
      damage: 0,
      text: 'Search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Toxic Ripper',
      cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      text: 'Your opponent\'s Active Pokémon is now Poisoned. During Pokémon Checkup, put 6 damage counters on that Pokémon instead of 1.'
    }
  ];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '130';

  public name: string = 'Toxicroak ex';

  public fullName: string = 'Toxicroak ex SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.deck.cards.length == 0) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 1, max: 2, allowCancel: false }
      ), cards => {
        player.deck.moveCardsTo(cards, player.hand);

        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialCondition.poisonDamage = 60;
      store.reduceEffect(state, specialCondition);
    }

    return state;
  }
}