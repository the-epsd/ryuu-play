import { StoreLike, State, Effect, AttackEffect, CardType, ChoosePokemonPrompt, EndTurnEffect, GameMessage, PlayerType, PokemonCard, SlotType, Stage, StateUtils } from '@ptcg/common';

export class Magneton extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Magnemite';
  public cardType: CardType = CardType.METAL;
  public regulationMark = 'F';
  public hp: number = 90;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.GRASS, value: -30 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Bounce Back',
    cost: [CardType.METAL, CardType.COLORLESS],
    damage: 50,
    text: 'Your opponent switches their Active Pokemon wtih 1 of their Benched Pokemon.'
  }];

  public set: string = 'ASR';
  public setNumber: string = '106';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Magneton';
  public fullName: string = 'Magneton ASR';

  public readonly BOUNCE_BACK_MARKER = 'BOUNCE_BACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      player.marker.addMarker(this.BOUNCE_BACK_MARKER, this);

    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.BOUNCE_BACK_MARKER)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.marker.removeMarker(this.BOUNCE_BACK_MARKER);

      if (player.active.cards[0] == this) {
        return state; // Not active
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        opponent.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (targets && targets.length > 0) {
          opponent.active.clearEffects();
          opponent.switchPokemon(targets[0]);
          return state;
        }
      });
    }

    return state;
  }
}