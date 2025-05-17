import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, CoinFlipPrompt, GameMessage, AddSpecialConditionsEffect, SpecialCondition } from "@ptcg/common";

export class Tadbulb extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 50;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{ 
    name: 'Thunder Wave', 
    cost: [CardType.LIGHTNING], 
    damage: 10, 
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.' 
  },
  ];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '77';

  public name: string = 'Tadbulb';

  public fullName: string = 'Tadbulb PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
  
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
        return state;
      });
      return state;
    }
    return state;
  }
}