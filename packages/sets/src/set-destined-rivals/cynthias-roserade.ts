import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State, Effect, DealDamageEffect, StateUtils, IS_ABILITY_BLOCKED } from "@ptcg/common";

export class CynthiasRoserade extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Cynthia\'s Roselia';
  public tags = [CardTag.CYNTHIAS];
  public cardType: CardType = G;
  public hp: number = 130;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Glorious Cheer',
    powerType: PowerType.ABILITY,
    text: 'Attacks from your Cynthia\'s Pokémon deal 30 more damage to your opponent\'s Active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Leaf Steps',
      cost: [G, C, C],
      damage: 80,
      text: ''
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV9a';
  public setNumber: string = '5';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cynthia\'s Roserade';
  public fullName: string = 'Cynthia\'s Roserade SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && StateUtils.isPokemonInPlay(effect.player, this)) {
      const player = effect.player;
      const attackingCard = effect.source.getPokemonCard();

      IS_ABILITY_BLOCKED(store, state, player, this);

      if (attackingCard !== undefined && attackingCard.tags.includes(CardTag.CYNTHIAS)) {
        effect.damage += 30;
      }
    }
    return state;
  }
}
