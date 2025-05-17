import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, AttackEffect, StateUtils, ChooseCardsPrompt, GameMessage } from "@ptcg/common";

export class TeamRocketsPorygon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Hacking',
      cost: [C],
      damage: 0,
      text: 'Discard 1 card from your hand. Then your opponent discards 1 card from their hand.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '81';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Porygon';
  public fullName: string = 'Team Rocket\'s Porygon SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Player chooses 1 card to discard
      if (player.hand.cards.length > 0) {
        return store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          {},
          { allowCancel: false, min: 1, max: 1 }
        ), cards => {
          cards = cards || [];

          // Discard the selected card
          player.hand.moveCardsTo(cards, player.discard);

          // Then opponent chooses 1 card to discard
          if (opponent.hand.cards.length > 0) {
            return store.prompt(state, new ChooseCardsPrompt(
              opponent,
              GameMessage.CHOOSE_CARD_TO_DISCARD,
              opponent.hand,
              {},
              { allowCancel: false, min: 1, max: 1 }
            ), oppCards => {
              oppCards = oppCards || [];

              // Discard the opponent's selected card
              opponent.hand.moveCardsTo(oppCards, opponent.discard);

              return state;
            });
          }
          return state;
        });
      }
      return state;
    }
    return state;
  }
}
