import { StoreLike, State, Effect, AttachEnergyEffect, AttachEnergyPrompt, AttackEffect, CardTag, CardTarget, CardType, EndTurnEffect, EnergyCard, EnergyType, GameError, GameMessage, PlayerType, PokemonCard, PokemonCardList, PowerEffect, PowerType, SlotType, Stage, StateUtils, SuperType } from '@ptcg/common';

export class IonosBelliboltex extends PokemonCard {
  public tags = [CardTag.IONOS, CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Iono\'s Tadbulb';
  public cardType: CardType = L;
  public hp: number = 280;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Electric Streamer',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn, you may attach a Basic [L] Energy card from your hand to 1 of your Iono\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Thunderous Bolt',
    cost: [L, L, L, C],
    damage: 230,
    text: 'During your next turn, this Pokemon can\'t attack.'
  }];

  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public set: string = 'JTG';
  public setNumber = '53';
  public name: string = 'Iono\'s Bellibolt ex';
  public fullName: string = 'Iono\'s Bellibolt ex JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Electro Streamer
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(L);
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (!card.tags.includes(CardTag.IONOS)) {
          blockedTo.push(target);
        }
      });

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' },
        { allowCancel: false, blockedTo }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const energyCard = transfer.card as EnergyCard;
          const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
          store.reduceEffect(state, attachEnergyEffect);
        }
      });

      return state;
    }

    // Cannot attack next turn
    if (effect instanceof AttackEffect && effect.source.cards.includes(this)) {
      if (effect.player.marker.hasMarker(PokemonCardList.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    // Thunderous Bolt
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      // Check marker
      if (effect.player.marker.hasMarker(PokemonCardList.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(PokemonCardList.ATTACK_USED_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(PokemonCardList.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(PokemonCardList.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(PokemonCardList.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(PokemonCardList.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(PokemonCardList.ATTACK_USED_2_MARKER, this);
    }

    return state;
  }

}