import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, ADD_POISON_TO_PLAYER_ACTIVE } from "@ptcg/common";

export class TeamRocketsZubat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = D;
  public hp: number = 50;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Poison Spray',
      cost: [ D ],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Poisoned.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '64';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Zubat';
  public fullName: string = 'Team Rocket\'s Zubat SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if(WAS_ATTACK_USED(effect, 0, this)){
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }
    return state;
  }
} 