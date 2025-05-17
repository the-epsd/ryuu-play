import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, Effect, PutDamageEffect, StateUtils, PlayerType, PowerEffect } from "@ptcg/common";

export class Shaymin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark = 'I';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [ C ];

  public powers = [{
    name: 'Flower Curtain',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to your Benched Pokémon without a Rule Box by attacks from your opponent\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Smash Kick',
    cost: [ C, C ],
    damage: 30,
    text: ''
  }];

  public set: string = 'SV9a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Shaymin';
  public fullName: string = 'Shaymin SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Flower Curtain
    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      const targetPlayer = StateUtils.findOwner(state, effect.target);

      let isShayminInPlay = false;
      targetPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isShayminInPlay = true;
        }
      });

      if (!isShayminInPlay) {
        return state;
      }

      if (effect.target.hasRuleBox()){
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}