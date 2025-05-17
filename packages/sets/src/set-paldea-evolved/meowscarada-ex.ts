import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State, Effect, PlayPokemonEffect, EndTurnEffect, PowerEffect, StateUtils, GameError, GameMessage, EnergyCard, EnergyType, ChooseCardsPrompt, SuperType, ChoosePokemonPrompt, PlayerType, SlotType, BoardEffect, AttackEffect } from "@ptcg/common";

export class Meowscaradaex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Floragato';

  public tags = [CardTag.POKEMON_ex];

  public cardType: CardType = CardType.GRASS;

  public hp: number = 310;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Bouquet Magic',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'You must discard a Basic [G] Energy card from your hand in order to use this Ability. Once during your turn, you may put 3 damage counters on 1 of your opponent\'s Benched Pokémon.'
  }];

  public attacks = [{
    name: 'Scratching Nails',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 100,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 120 more damage.'
  }];

  public regulationMark = 'G';

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '15';

  public name: string = 'Meowscarada ex';

  public fullName: string = 'Meowscarada ex PAL';

  public readonly BOUQUET_MAGIC_MARKER = 'BOUQUET_MAGIC_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.BOUQUET_MAGIC_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.BOUQUET_MAGIC_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.marker.hasMarker(this.BOUQUET_MAGIC_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.name === 'Grass Energy';
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.BOUQUET_MAGIC_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Grass Energy' },
        { allowCancel: false, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }

        player.hand.moveCardsTo(cards, player.discard);

        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false },
        ), selected => {
          const targets = selected || [];

          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              cardList.addBoardEffect(BoardEffect.ABILITY_USED);
            }
          });

          targets.forEach(target => {
            target.damage += 30;
            player.marker.addMarker(this.BOUQUET_MAGIC_MARKER, this);
          });
        });
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.active.damage > 0) {
        effect.damage += 120;
      }
    }
    return state;
  }
}