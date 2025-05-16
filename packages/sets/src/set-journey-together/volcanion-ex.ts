import { StoreLike, State, Effect, AddSpecialConditionsPowerEffect, AttachEnergyPrompt, AttackEffect, CardTag, CardType, EndTurnEffect, GameError, GameMessage, PlayerType, PlayPokemonEffect, PokemonCard, PowerEffect, PowerType, SlotType, SpecialCondition, Stage, StateUtils, SuperType } from '@ptcg/common';

export class Volcanionex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 220;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Scorching Steam',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokemon is in your Active Spot, you may make your opponent\'s Active Pokémon Burned.'
  }];

  public attacks = [
    {
      name: 'Heat Cyclone',
      cost: [R, R, C],
      damage: 160,
      text: 'Move an Energy from this Pokémon to 1 of your Benched Pokémon.'
    }
  ];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Volcanion ex';
  public fullName: string = 'Volcanion ex JTG';

  public readonly SCORCHING_STEAM = 'SCORCHING_STEAM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.SCORCHING_STEAM, this);
    }

    // Scorching Steam
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.SCORCHING_STEAM, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const specialCondition = new AddSpecialConditionsPowerEffect(
        opponent,
        this,
        opponent.active,
        [SpecialCondition.BURNED]
      );
      store.reduceEffect(state, specialCondition);

      player.marker.addMarker(this.SCORCHING_STEAM, this);
      return store.reduceEffect(state, specialCondition);
    }

    // Heat Cyclone
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.active.moveCardTo(transfer.card, target);
        }
      });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.SCORCHING_STEAM, this);
    }

    return state;
  }

}