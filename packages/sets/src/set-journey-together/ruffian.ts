import { StoreLike, State, Effect, CardTarget, ChooseCardsPrompt, ChoosePokemonPrompt, EnergyCard, EnergyType, GameError, GameMessage, PlayerType, SlotType, StateUtils, SuperType, TrainerCard, TrainerEffect, TrainerType, MOVE_CARDS } from '@ptcg/common';

export class Ruffian extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'I';
  public set: string = 'JTG';
  public name: string = 'Ruffian';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '157';
  public fullName: string = 'Ruffian JTG';
  public text: string = 'Discard a Pokémon Tool and a Special Energy from 1 of your opponent\'s Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      let energyOrToolcard = false;
      const blocked: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.cards.some(c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL)) {
          energyOrToolcard = true;
        } else if (cardList.cards.some(c => c instanceof TrainerCard && c.trainerType === TrainerType.TOOL)) {
          energyOrToolcard = true;
        } else {
          blocked.push(target);
        }
      });

      if (!energyOrToolcard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false, blocked }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }

        const target = targets[0];

        // Handle tools first
        if (target.tools.length > 0) {
          if (target.tools.length > 1) {
            store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_DISCARD,
              target,
              { trainerType: TrainerType.TOOL },
              { min: 1, max: 1, allowCancel: false }
            ), selected => {
              MOVE_CARDS(store, state, target, opponent.discard, { cards: selected });
              // Handle special energies after tool is discarded
              const specialEnergies = target.cards.filter(card =>
                card instanceof EnergyCard && card.energyType === EnergyType.SPECIAL
              );

              if (specialEnergies.length > 0) {
                store.prompt(state, new ChooseCardsPrompt(
                  player,
                  GameMessage.CHOOSE_CARD_TO_DISCARD,
                  target,
                  { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
                  { min: 1, max: 1, allowCancel: false }
                ), selected => {
                  MOVE_CARDS(store, state, target, opponent.discard, { cards: selected });
                  MOVE_CARDS(store, state, player.supporter, player.discard);
                });
              } else {
                MOVE_CARDS(store, state, player.supporter, player.discard);
              }
            });
          } else {
            MOVE_CARDS(store, state, target, opponent.discard, { cards: target.tools });
            target.tools = [];
          }
        }

        // Handle special energies if no tools were handled
        if (target.tools.length === 0) {
          const specialEnergies = target.cards.filter(card =>
            card instanceof EnergyCard && card.energyType === EnergyType.SPECIAL
          );

          if (specialEnergies.length > 0) {
            store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_DISCARD,
              target,
              { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
              { min: 1, max: 1, allowCancel: false }
            ), selected => {
              MOVE_CARDS(store, state, target, opponent.discard, { cards: selected });
              MOVE_CARDS(store, state, player.supporter, player.discard);
            });
          } else {
            MOVE_CARDS(store, state, player.supporter, player.discard);
          }
        }
      });
    }
    return state;
  }
}