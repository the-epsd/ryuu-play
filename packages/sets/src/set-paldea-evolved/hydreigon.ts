import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, Effect, EndTurnEffect, PlayPokemonEffect, PowerEffect, CardList, GameError, GameMessage, EnergyCard, AttachEnergyPrompt, PlayerType, SlotType, SuperType, BoardEffect, StateUtils } from "@ptcg/common";

export class Hydreigon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = CardType.DARK;
  public hp: number = 180;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Zweilous';

  public powers = [{
    name: 'Tri Howl',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: ' Once during your turn, you may look at the top 3 cards of your deck and attach any number of Energy cards you find there to your Pokémon in any way you like. Discard the other cards.'
  }];

  public attacks = [{
    name: 'Dark Cutter',
    cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS],
    damage: 160,
    text: ''
  }];

  public set = 'PAL';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '140';
  public name = 'Hydreigon';
  public fullName = 'Hydreigon PAL';

  public readonly TRI_HOWL_MARKER = 'TRI_HOWL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = (effect as EndTurnEffect).player;
      player.marker.removeMarker(this.TRI_HOWL_MARKER, this);
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      player.marker.removeMarker(this.TRI_HOWL_MARKER, this);
      return state;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const temp = new CardList();

      if (player.marker.hasMarker(this.TRI_HOWL_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.deck.moveTo(temp, 3);

      // Check if any cards drawn are basic energy
      const energyCardsDrawn = temp.cards.filter(card => {
        return card instanceof EnergyCard;
      });

      // If no energy cards were drawn, move all cards to discard
      if (energyCardsDrawn.length == 0) {
        player.marker.addMarker(this.TRI_HOWL_MARKER, this);
        temp.cards.slice(0, 3).forEach(card => {
          temp.moveCardTo(card, player.discard);
        });
      }

      if (energyCardsDrawn.length > 0) {

        // Prompt to attach energy if any were drawn
        return store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          temp, // Only show drawn energies
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          { superType: SuperType.ENERGY },
          { min: 0, max: energyCardsDrawn.length, allowCancel: false }
        ), transfers => {

          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              cardList.addBoardEffect(BoardEffect.ABILITY_USED);
            }
          });

          //if transfers = 0, put both in discard
          if (transfers.length === 0) {
            temp.cards.slice(0, 3).forEach(card => {
              temp.moveCardTo(card, player.discard);
              player.marker.addMarker(this.TRI_HOWL_MARKER, this);
            });
          }

          // Attach energy based on prompt selection
          if (transfers) {
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              temp.moveCardTo(transfer.card, target); // Move card to target
            }
            temp.cards.forEach(card => {
              temp.moveCardTo(card, player.discard); // Move card to hand
              player.marker.addMarker(this.TRI_HOWL_MARKER, this);
            });
          }
          return state;
        });
      }
    }
    return state;
  }
}
