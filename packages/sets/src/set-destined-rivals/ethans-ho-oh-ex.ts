import { PokemonCard, CardTag, Stage, CardType, PowerType, StoreLike, State, Effect, PlayPokemonEffect, PowerEffect, BLOCK_EFFECT_IF_MARKER, EnergyCard, EnergyType, GameError, GameMessage, StateUtils, CardTarget, PlayerType, AttachEnergyPrompt, SlotType, SuperType, ADD_MARKER, ABILITY_USED, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, PokemonCardList, HealEffect } from "@ptcg/common";

export class EthansHoOhex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.ETHANS];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = R;

  public hp: number = 230;

  public weakness = [{ type: W }];

  public retreat = [C, C];

  public powers = [{
    name: 'Golden Flame',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may attach up to 2 Basic [R] Energy from your hand to 1 of your Benched Ethan\'s Pokémon.'
  }];

  public attacks = [
    {
      name: 'Shining Feather',
      cost: [R, R, R, R],
      damage: 160,
      text: 'Heal 50 damage from each of your Pokémon.'
    }
  ];

  public regulationMark = 'I';

  public set: string = 'SV9a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '20';

  public name: string = 'Ethan\'s Ho-Oh ex';

  public fullName: string = 'Ethan\'s Ho-Oh ex SV9a';

  public readonly SHINING_FEATHER_MARKER = 'SHINING_FEATHER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.SHINING_FEATHER_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      BLOCK_EFFECT_IF_MARKER(this.SHINING_FEATHER_MARKER, player, this);

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.FIRE);
      });

      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const cardList = StateUtils.findCardList(state, this);
      if (cardList === undefined) {
        return state;
      }

      const blocked2: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (!card.tags.includes(CardTag.ETHANS)) {
          blocked2.push(target);
        }
      });

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_ACTIVE,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { allowCancel: false, sameTarget: true, min: 0, max: 2, blockedTo: blocked2 }
      ), transfers => {
        transfers = transfers || [];

        ADD_MARKER(this.SHINING_FEATHER_MARKER, player, this);
        ABILITY_USED(player, this);

        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.hand.moveCardTo(transfer.card, target);
        }

        return state;
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SHINING_FEATHER_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList: PokemonCardList) => {
        const healEffect = new HealEffect(player, cardList, 50);
        state = store.reduceEffect(state, healEffect);
        return state;
      });
    }
    return state;
  }
}