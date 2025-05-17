import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, ADD_SLEEP_TO_PLAYER_ACTIVE } from "@ptcg/common";

export class TeamRocketsDrowzee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Hypnotic Ray',
      cost: [ P ],
      damage: 10,
      text: 'Your opponent\'s Active Pokemon is now Asleep.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Drowzee';
  public fullName: string = 'Team Rocket\'s Drowzee SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
