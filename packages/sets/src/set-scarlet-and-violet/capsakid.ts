import { PokemonCard, Stage, CardType, Resistance, StoreLike, State, Effect, AttackEffect, AttachEnergyPrompt, GameMessage, PlayerType, SlotType, SuperType, EnergyType, StateUtils, ShuffleDeckPrompt } from "@ptcg/common";

export class Capsakid extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance: Resistance[] = [];
  public retreat = [C];

  public attacks = [{
    name: 'Increasing Spice',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Basic [R] Energy card and attach it to this Pokémon. Then, shuffle your deck.'
  },
  {
    name: 'Playful Kick',
    cost: [G, C, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public set = 'SVI';
  public name: string = 'Capsakid';
  public fullName: string = 'Capsakid SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { allowCancel: false, min: 0, max: 1 },
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return state;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.deck.moveCardTo(transfer.card, target);
        }
        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }
    return state;
  }
}