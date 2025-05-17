import { PokemonCard, CardTag, Stage, CardType } from "@ptcg/common";

export class ArvensSkwovet extends PokemonCard {
  public regulationMark = 'I';
  public tags = [CardTag.ARVENS];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Gnaw Through',
      cost: [C],
      damage: 10,
      text: 'Before doing damage, discard all Pokémon Tool cards from your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'SV9a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';
  public name: string = 'Arven\'s Skwovet';
  public fullName: string = 'Arven\'s Skwovet SV9a';

  // public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
  //   if (WAS_ATTACK_USED(effect, 0, this)){

  //     const activePokemon = effect.opponent.active;
  //     for (const tool of activePokemon.tools) {
  //       REMOVE_TOOL(store, state, activePokemon, tool, SlotType.DISCARD);
  //     }

  //     effect.damage = 10;
  //   }

  //   return state;
  // }
}