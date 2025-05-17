import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State, Effect, EndTurnEffect, PowerEffect, GameError, GameMessage, ChooseCardsPrompt, PlayerType, BoardEffect, AttackEffect, TrainerCard, TrainerType } from "@ptcg/common";

export class TeamRocketsPorygonZ extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public tags = [CardTag.TEAM_ROCKET];
  public evolvesFrom = 'Team Rocket\'s Porygon2';
  public cardType: CardType = C;
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Reconstitute',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'You must discard 2 cards from your hand in order to use this Ability. Once during your turn, you may draw a card.'
  }];

  public attacks = [
    {
      name: 'Control R',
      cost: [C, C],
      damage: 20,
      damageCalculation: '*',
      text: 'This attack does 20 damage for each Supporter in your discard pile with "Team Rocket" in its name.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '83';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Porygon-Z';
  public fullName: string = 'Team Rocket\'s Porygon-Z SV10';

  public readonly RECONSTITUTE_MARKER = 'RECONSTITUTE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Reset ability usage at end of turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.RECONSTITUTE_MARKER, this)) {
      effect.player.marker.removeMarker(this.RECONSTITUTE_MARKER, this);
    }

    // Reconstitute ability
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      // Check if ability was already used this turn
      if (player.marker.hasMarker(this.RECONSTITUTE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      // Need at least 2 cards to discard
      if (player.hand.cards.length < 2) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Need at least 1 card in deck to draw
      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Choose 2 cards to discard
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: false, min: 2, max: 2 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }

        // Mark ability as used
        player.marker.addMarker(this.RECONSTITUTE_MARKER, this);

        // Add visual effect to show ability was used
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        // Discard the selected cards
        player.hand.moveCardsTo(cards, player.discard);

        // Draw a card
        player.deck.moveTo(player.hand, 1);
      });

      return state;
    }

    // Control R attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      // Count Team Rocket Supporters in discard pile
      const teamRocketSupporters = player.discard.cards.filter(card =>
        card instanceof TrainerCard &&
        card.name.includes('Team Rocket') &&
        card.trainerType === TrainerType.SUPPORTER
      ).length;

      // Set damage based on count
      effect.damage = 20 * teamRocketSupporters;

      return state;
    }

    return state;
  }
}
