import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, EnergyCard, EnergyType, AttachEnergyPrompt, GameMessage, PlayerType, SlotType, SuperType, StateUtils } from "@ptcg/common";

export class Magnemite extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 50;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Magnetic Charge',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Attach up to 2 Basic [L] Energy cards from your discard pile to 1 of your Benched Pokémon.'
  },
  {
    name: 'Speed Ball',
    cost: [CardType.LIGHTNING, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];

  public set: string = 'PAL';
  public regulationMark: string = 'G';
  public setNumber: string = '65';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Magnemite';
  public fullName: string = 'Magnemite PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        return state;
      }

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.LIGHTNING);
      });

      if (!hasEnergyInDiscard) {
        return state;
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' },
        { allowCancel: true, min: 1, max: 2 }
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
      });

      return state;
    }

    return state;
  }
}