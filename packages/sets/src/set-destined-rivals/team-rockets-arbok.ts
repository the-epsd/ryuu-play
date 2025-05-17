import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State, Effect, PlayPokemonEffect, StateUtils, IS_ABILITY_BLOCKED, GameError, GameMessage, WAS_ATTACK_USED, PlayerType, PutDamageEffect } from "@ptcg/common";

export class TeamRocketsArbok extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Team Rocket\'s Ekans';
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = D;
  public hp: number = 130;
  public weakness = [{ type: F }];
  public retreat = [ C, C ];

  public powers = [{
    name: 'Intimidating Glare',
    powerType: PowerType.ABILITY,
    text: 'If this Pokemon is your Active Pokemon, your opponent can\'t play any Pokemon cards with Abilities from their hand (excluding Rocket\'s Pokemon).'
  }];

  public attacks = [
    {
      name: 'Spinning Tail',
      cost: [D, D, D],
      damage: 0,
      text: 'This attack does 30 damage to each of your opponent\'s Pokemon (Don\'t apply Weakness and Resistance for Benched Pokemon).'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '57';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Arbok';
  public fullName: string = 'Team Rocket\'s Arbok SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Intimidating Glare
    if (effect instanceof PlayPokemonEffect){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = effect.pokemonCard;

      if (opponent.active.getPokemonCard() !== this){
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, opponent, this)){ return state; }

      if (pokemonCard.powers.length > 0 && pokemonCard.powers[0].powerType === PowerType.ABILITY && !pokemonCard.tags.includes(CardTag.TEAM_ROCKET)){
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    // Spinning Tail
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        const damageEffect = new PutDamageEffect(effect, 30);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });
    }
    
    return state;
  }
}
