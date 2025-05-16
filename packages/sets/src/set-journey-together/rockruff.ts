import { StoreLike, State, Effect, BLOCK_IF_DECK_EMPTY, BoardEffect, CardList, CardType, ConfirmCardsPrompt, GameMessage, PlayerType, PokemonCard, Stage, WAS_ATTACK_USED } from '@ptcg/common';

export class Rockruff extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark = 'I';
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Dig It Up',
    cost: [C],
    damage: 0,
    text: 'Look at the top card of your deck. You may discard that card.'
  },
  {
    name: 'Stampede',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';
  public name: string = 'Rockruff';
  public fullName: string = 'Rockruff JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      BLOCK_IF_DECK_EMPTY(player);

      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 1);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

      return store.prompt(state, new ConfirmCardsPrompt(
        player.id,
        GameMessage.DISCARD_FROM_TOP_OF_DECK,
        deckTop.cards, // Fix error by changing toArray() to cards
        { allowCancel: true },
      ), selected => {

        if (selected !== null) {
          // Discard card
          deckTop.moveCardsTo(deckTop.cards, player.discard);
        } else {
          // Move back to the top of your deck
          deckTop.moveToTopOfDestination(player.deck);
        }
      });
    }
    return state;
  }
}