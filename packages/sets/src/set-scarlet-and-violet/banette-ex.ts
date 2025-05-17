import { PokemonCard, CardTag, Stage, CardType, StoreLike, State, Effect, AttackEffect, StateUtils, ShowCardsPrompt, GameMessage, TrainerCard, PlayItemEffect, GameError, EndTurnEffect } from "@ptcg/common";

export class Banetteex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Shuppet';
  public cardType: CardType = P;
  public hp: number = 250;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Everlasting Darkness',
    cost: [P],
    damage: 30,
    text: 'During your opponent\'s next turn, they can\'t play any Item cards from their hand.',
  },
  {
    name: 'Poltergeist',
    cost: [P, C],
    damage: 60,
    damageCalculation: 'x',
    text: 'Your opponent reveals their hand. This attack does 60 damage for each Trainer card you find there.',
  }];

  public regulationMark = 'G';
  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public name: string = 'Banette ex';
  public fullName: string = 'Banette ex SVI';

  public readonly OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.marker.addMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      state = store.prompt(state, new ShowCardsPrompt(
        player.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        opponent.hand.cards
      ), () => {

        const cardsInOpponentHand = opponent.hand.cards.filter(card => card instanceof TrainerCard).length;
        const damage = opponent.hand.cards.slice(0, cardsInOpponentHand);

        effect.damage = damage.length * 60;

      });
    }

    if (effect instanceof PlayItemEffect) {
      const player = effect.player;
      if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
    }
    return state;
  }
}

