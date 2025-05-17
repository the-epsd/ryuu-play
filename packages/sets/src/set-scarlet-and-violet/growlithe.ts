import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, AttachEnergyPrompt, GameMessage, PlayerType, SlotType, SuperType, EnergyType, StateUtils, ShuffleDeckPrompt } from "@ptcg/common";

export class Growlithe extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType = CardType.FIRE;

  public hp = 90;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Stoke',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Search your deck for up to 2 Basic [R] Energy cards and attach them to this Pokémon. Then, shuffle your deck.'
    },
    {
      name: 'Fire Claws',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'SVI';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '31';

  public name: string = 'Growlithe';

  public fullName: string = 'Growlithe SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      
      store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { min: 0, max: 2, allowCancel: true }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.deck.moveCardTo(transfer.card, target);
        }

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }
    return state;
  }
}