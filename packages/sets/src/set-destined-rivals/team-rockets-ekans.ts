import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, COIN_FLIP_PROMPT, ADD_PARALYZED_TO_PLAYER_ACTIVE } from "@ptcg/common";

export class TeamRocketsEkans extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Hold Back',
      cost: [C],
      damage: 0,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
    },
    {
      name: 'Gnaw',
      cost: [D],
      damage: 10,
      text: ''
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '56';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Ekans';
  public fullName: string = 'Team Rocket\'s Ekans SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)){
      COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result){ ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this); } });
    }
    
    return state;
  }
}
