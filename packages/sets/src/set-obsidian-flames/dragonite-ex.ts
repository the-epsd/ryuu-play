import { PokemonCard, CardTag, Stage, CardType, StoreLike, State, Effect, EndTurnEffect, AttackEffect, GameError, GameMessage, CoinFlipPrompt, PutDamageEffect, StateUtils } from "@ptcg/common";

export class Dragoniteex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dragonair';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 330;

  public weakness = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Wing Attack',
    cost: [CardType.COLORLESS],
    damage: 70,
    text: ''
  }, {
    name: 'Mighty Meteor',
    cost: [CardType.WATER, CardType.LIGHTNING],
    damage: 140,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 140 more damage.' +
      'If tails, during your next turn, this Pokémon can\'t attack.'
  }];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '159';

  public name: string = 'Dragonite ex';

  public fullName: string = 'Dragonite ex OBF';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;

      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {

        if (!result) {
          effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
        }

        if (result) {
          effect.damage += 140;
        }
      });
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}