import { TrainerCard, TrainerType, StoreLike, State, Effect, PutDamageEffect, StateUtils, ToolEffect, CardTag } from "@ptcg/common";

export class ChoiceBelt extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '176';

  public regulationMark = 'G';

  public name: string = 'Choice Belt';

  public fullName: string = 'Choice Belt PAL';

  public text: string =
    'The attacks of the Pokémon this card is attached to do 30 more damage to your opponent\'s Active Pokémon V (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.source.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      // Try to reduce ToolEffect, to check if something is blocking the tool from working
      try {
        const stub = new ToolEffect(effect.player, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (effect.target !== player.active && effect.target !== opponent.active) {
        return state;
      }

      const targetCard = effect.target.getPokemonCard();
      if (targetCard && targetCard.tags.includes(CardTag.POKEMON_V) || targetCard && targetCard.tags.includes(CardTag.POKEMON_VMAX) || targetCard && targetCard.tags.includes(CardTag.POKEMON_VSTAR)) {

        const attack = effect.attack;
        if (attack && attack.damage > 0 && effect.target === opponent.active) {

          effect.damage += 30;
        }
      }
      return state;
    }
    return state;
  }
}