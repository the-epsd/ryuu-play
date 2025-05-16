import { StoreLike, State, Effect, AttackEffect, CardType, GameError, GameMessage, PlayerType, PlayItemEffect, PokemonCard, PowerEffect, PowerType, Stage, StateUtils } from '@ptcg/common';

export class Tyranitar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Pupitar';
  public cardType: CardType = D;
  public hp: number = 190;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Daunting Gaze',
    powerType: PowerType.ABILITY,
    text: 'While this Pokémon is in the Active Spot, your opponent can\'t play any Item cards from their hand.'
  }];

  public attacks = [{
    name: 'Crackling Stomp',
    cost: [D, C],
    damage: 150,
    text: 'Discard the top 2 cards of your opponent\'s deck.'
  }];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '95';
  public name: string = 'Tyranitar';
  public fullName: string = 'Tyranitar JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.deck.moveTo(opponent.discard, 2);
    }

    // beta vileplume gaming
    if (effect instanceof PlayItemEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isTyranitarInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isTyranitarInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isTyranitarInPlay = true;
        }
      });

      if (!isTyranitarInPlay) {
        return state;
      }

      if (player.active.getPokemonCard() === this && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      if (opponent.active.getPokemonCard() === this) {
        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }

        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }

    }

    return state;
  }

}
