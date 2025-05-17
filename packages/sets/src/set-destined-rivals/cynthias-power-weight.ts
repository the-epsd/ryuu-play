import { TrainerCard, TrainerType, CardTag, StoreLike, State, Effect, CheckHpEffect, ToolEffect } from "@ptcg/common";

export class CynthiasPowerWeight extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;
  public tags = [CardTag.CYNTHIAS];
  public regulationMark = 'I';
  public set: string = 'SV9a';
  public setNumber: string = '60';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cynthia\'s Power Weight';
  public fullName: string = 'Cynthia\'s Power Weight SV9a';

  public text: string =
    'The Cynthia\'s Pokémon this card is attached to gets +70 HP.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckHpEffect && effect.target.cards.includes(this)) {
      const card = effect.target.getPokemonCard();

      // Try to reduce ToolEffect, to check if something is blocking the tool from working
      try {
        const stub = new ToolEffect(effect.player, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (card === undefined) {
        return state;
      }

      if (card.tags.includes(CardTag.CYNTHIAS)) {
        effect.hp += 70;
      }
    }
    return state;
  }

}
