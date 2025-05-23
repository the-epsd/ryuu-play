import { StoreLike, State, Effect, AttachEnergyEffect, AttachEnergyPrompt, EnergyCard, EnergyType, GameError, GameMessage, PlayerType, SlotType, StateUtils, SuperType, TrainerCard, TrainerEffect, TrainerType, MOVE_CARDS } from '@ptcg/common';

export class GardeniasVigor extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'ASR';
  public regulationMark = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '143';
  public name: string = 'Gardenia\'s Vigor';
  public fullName: string = 'Gardenia\'s Vigor ASR';
  public text: string = 'Draw 2 cards. If you drew any cards in this way, attach up to 2 [G] Energy cards from your hand to 1 of your Benched Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const hasBenched = player.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      MOVE_CARDS(store, state, player.deck, player.hand, { count: 2 });

      // const hasEnergyInHand = player.hand.cards.some(c => {
      //   return c instanceof EnergyCard
      //     && c.energyType === EnergyType.BASIC
      //     && c.provides.includes(CardType.GRASS);
      // });
      // if (!hasEnergyInHand) {
      //   throw new GameError(GameMessage.CANNOT_USE_POWER);
      // }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Grass Energy' },
        { min: 0, max: 2, allowCancel: false, differentTargets: false, sameTarget: true }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const energyCard = transfer.card as EnergyCard;
          const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
          store.reduceEffect(state, attachEnergyEffect);
          MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [effect.trainerCard] });

        }
      });
    }

    return state;
  }

}
