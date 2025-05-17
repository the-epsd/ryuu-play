import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State, Effect, PutCountersEffect, PlayerType, GamePhase, WAS_ATTACK_USED, EnergyCard } from "@ptcg/common";

export class TeamRocketsArticuno extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ C ];

  public powers = [{
    name: 'Resistant Veil',
    powerType: PowerType.ABILITY,
    text: 'Prevent all effects of your opponent\'s Pokémon\'s attacks done to your Basic Team Rocket\'s Pokémon. (Damage is not an effect.)'
  }];

  public attacks = [
    {
      name: 'Dark Frost',
      cost: [W, C, C],
      damage: 60,
      damageCalculation: '+',
      text: 'If this Pokémon has Team Rocket Energy attached, this attack does 60 more damage.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '22';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Articuno';
  public fullName: string = 'Team Rocket\'s Articuno SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Resistant Veil
    if (effect instanceof PutCountersEffect){
      const opponent = effect.opponent;

      let isArticunoInPlay = false;
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card.getPokemonCard() === this){
          isArticunoInPlay = true;
        }
      });
      if (!isArticunoInPlay){ return state; }

      if (state.phase === GamePhase.ATTACK){
        const target = effect.target;
        if (target.getPokemonCard()?.stage === Stage.BASIC && target.getPokemonCard()?.tags.includes(CardTag.TEAM_ROCKET)){ 
          effect.preventDefault = true;
        }
      }
    }    

    // Dark Frost
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.player.active.cards.some(c => c instanceof EnergyCard && c.name === 'Team Rocket Energy')){ effect.damage += 60; }
    }

    return state;
  }
}
