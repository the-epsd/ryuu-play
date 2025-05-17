import { PokemonCard, Stage, CardType, Weakness, Power, PowerType, Attack, StoreLike, State, Effect, WAS_POWER_USED, PlayerType, ATTACH_ENERGY_PROMPT, SlotType, SuperType, EnergyType, WAS_ATTACK_USED, DISCARD_ALL_ENERGY_FROM_POKEMON } from "@ptcg/common";

export class Pawmot extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Pawmo';
  public cardType: CardType = L;
  public hp: number = 130;
  public weakness: Weakness[] = [{ type: F }];
  public retreat: CardType[] = [];

  public powers: Power[] = [{
    name: 'Electrogenesis',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may search your deck for a Basic [L] Energy card ' +
      'and attach it to this Pokémon. Then, shuffle your deck.'
  }];

  public attacks: Attack[] = [
    { name: 'Electro Paws', cost: [L, L, C], damage: 230, text: 'Discard all Energy from this Pokémon.' },
  ];

  public set: string = 'SVI';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '76';
  public name: string = 'Pawmot';
  public fullName: string = 'Pawmot SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const blocked: number[] = [];
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card !== this)
          blocked.push(target.index);
      });
      return ATTACH_ENERGY_PROMPT(
        store, state, effect.player, PlayerType.BOTTOM_PLAYER, SlotType.DECK, [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' },
        { min: 0, max: 1, allowCancel: false, blocked },
      );
    }

    if (WAS_ATTACK_USED(effect, 0, this))
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);

    return state;
  }
}