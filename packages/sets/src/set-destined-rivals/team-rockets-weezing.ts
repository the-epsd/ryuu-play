import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, PlayerType } from "@ptcg/common";

export class TeamRocketsWeezing extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Team Rocket\'s Koffing';
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = D;
  public hp: number = 130;
  public weakness = [{ type: F }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'All-Out Explosion',
      cost: [ D, C ],
      damage: 40,
      damageCalculation: 'x',
      text: 'This attack does 40 damage for each Pokémon in play with Koffing or Weezing in its name.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Team Rocket\'s Weezing';
  public fullName: string = 'Team Rocket\'s Weezing SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;
      const opponent = effect.opponent;

      let koffingsAndWeezings = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card.getPokemonCard()?.name.includes('Koffing') || card.getPokemonCard()?.name.includes('Weezing')){
          koffingsAndWeezings++;
        }
      });
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card.getPokemonCard()?.name.includes('Koffing') || card.getPokemonCard()?.name.includes('Weezing')){
          koffingsAndWeezings++;
        }
      });
      

      effect.damage = 40 * koffingsAndWeezings;
    }

    return state;
  }
}