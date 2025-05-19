import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, StateUtils, SpecialCondition, PlayItemEffect, GameError, GameMessage, EndTurnEffect } from "@ptcg/common";

export class Venomoth extends PokemonCard {

  public regulationMark = 'G';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Venonat';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 90;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];
  public attacks = [
    {
      name: 'Perplexing Powder',
      cost: [CardType.GRASS],
      damage: 30,
      text: 'Your opponent\'s Active Pokémon is now Confused. During your opponent\'s next turn, they can\'t play any Item cards from their hand.',
    },
    {
      name: 'Speed Wing',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 90,
      text: '',
    }
  ];
  public set: string = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Venomoth';
  public fullName: string = 'Venomoth MEW';

  public readonly PERPLEXING_POWDER_MARKER = 'PERPLEXING_POWDER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.specialConditions.push(SpecialCondition.CONFUSED);
      opponent.marker.addMarker(this.PERPLEXING_POWDER_MARKER, this);
    }


    if (effect instanceof PlayItemEffect) {
      const player = effect.player;
      if (player.marker.hasMarker(this.PERPLEXING_POWDER_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.PERPLEXING_POWDER_MARKER, this);
    }
    return state;
  }
}

