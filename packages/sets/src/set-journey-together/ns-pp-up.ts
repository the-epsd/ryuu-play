import { StoreLike, State, Effect, AttachEnergyPrompt, CardTag, CardTarget, EnergyCard, EnergyType, GameError, GameMessage, PlayerType, SlotType, StateUtils, SuperType, TrainerCard, TrainerEffect, TrainerType } from '@ptcg/common';

export class NsPPUp extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public tags = [CardTag.NS];
  public regulationMark = 'I';
  public set: string = 'JTG';
  public name: string = 'N\'s PP Up';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '153';
  public fullName: string = 'N\'s PP Up JTG';
  public text: string = 'Attach 1 Basic Energy from your discard pile to 1 of your Benched N\'s Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC;
      });

      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let hasNsPokemonInPlay = false;

      player.bench.forEach(list => {
        if (list && list.cards.some(card => card.tags.includes(CardTag.NS))) {
          hasNsPokemonInPlay = true;
        }
      });

      if (!hasNsPokemonInPlay) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blocked2: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (!card.tags.includes(CardTag.NS)) {
          blocked2.push(target);
        }
      });

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 1, max: 1, blockedTo: blocked2 }
      ), transfers => {
        transfers = transfers || [];

        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }

        player.supporter.moveCardTo(this, player.discard);
      });
    }

    return state;
  }

}
