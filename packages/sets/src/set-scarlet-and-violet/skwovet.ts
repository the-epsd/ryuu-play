import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, Effect, PlayPokemonEffect, PowerEffect, GameError, GameMessage, CardList, PlayerType, BoardEffect, EndTurnEffect } from "@ptcg/common";

export class Skwovet extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Nest Stash',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may shuffle your hand and put ' +
      'it on the bottom of your deck. If you put any cards on the ' +
      'bottom of your deck in this way, draw a card.'
  }];

  public attacks = [{
    name: 'Bite',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '151';

  public name: string = 'Skwovet';

  public fullName: string = 'Skwovet SVI';

  public readonly NEST_STASH_MARKER = 'NEST_STASH_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.NEST_STASH_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;
      const cards = player.hand.cards.filter(c => c !== this);

      if (player.marker.hasMarker(this.NEST_STASH_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Create deckBottom and move hand into it
      const deckBottom = new CardList();
      player.hand.moveTo(deckBottom, cards.length);

      // Later, move deckBottom to player's deck

      deckBottom.moveTo(player.deck, cards.length);
      player.marker.addMarker(this.NEST_STASH_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

      player.deck.moveTo(player.hand, 1);

      return state;
    }
    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.NEST_STASH_MARKER, this);
    }
    return state;
  }

}