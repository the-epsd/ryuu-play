import { StoreLike, State, Effect, CardType, CheckProvidedEnergyEffect, GamePhase, IS_ABILITY_BLOCKED, PokemonCard, PokemonCardList, PowerType, PutDamageEffect, Stage, StateUtils, WAS_ATTACK_USED } from '@ptcg/common';

export class Regirock extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Metal Shield',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has any Energy attached, it takes 30 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Buster Lariat',
    cost: [F, F, F],
    damage: 120,
    text: 'This attack\'s damage isn\'t affected by Resistance.'
  }];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name: string = 'Regirock';
  public fullName: string = 'Regirock JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Reduce damage by 30
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const player = StateUtils.findOwner(state, effect.target);

      // It's not this pokemon card
      if (pokemonCard !== this || state.phase !== GamePhase.ATTACK || IS_ABILITY_BLOCKED(store, state, player, this))
        return state;

      // Check attached energy 
      // Check attached energy 
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
      state = store.reduceEffect(state, checkProvidedEnergy);

      if (checkProvidedEnergy.energyMap.length > 0)
        effect.damage = Math.max(0, effect.damage - 30);

      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this))
      effect.ignoreResistance = true;

    return state;
  }
}