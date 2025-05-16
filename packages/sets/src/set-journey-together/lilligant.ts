import { StoreLike, State, Effect, CardType, CheckPokemonTypeEffect, DealDamageEffect, PlayerType, PokemonCard, PowerEffect, PowerType, Stage, StateUtils } from '@ptcg/common';

export class Lilligant extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Petilil';
  public cardType: CardType = G;
  public hp: number = 110;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [
    {
      name: 'Sunny Day',
      powerType: PowerType.ABILITY,
      text: 'Attacks used by your [G] Pokémon and [R] Pokémon do 20 more damage to your opponent\'s Active Pokémon(before applying Weakness and Resistance).'
    }
  ];

  public attacks = [
    {
      name: 'Spinning Attack',
      cost: [G, G, C],
      damage: 60,
      text: ''
    }
  ];

  public regulationMark = 'H';
  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Lilligant';
  public fullName: string = 'Lilligant JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      const hasLilligantInPlay = player.bench.some(b => b.cards.includes(this)) || player.active.cards.includes(this);
      let numberOfLilligantInPlay = 0;

      if (hasLilligantInPlay) {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          if (cardList.cards.includes(this)) {
            numberOfLilligantInPlay++;
          }
        });
      }

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if ((checkPokemonTypeEffect.cardTypes.includes(CardType.GRASS) || checkPokemonTypeEffect.cardTypes.includes(CardType.FIRE)) && effect.target === opponent.active) {
        effect.damage += 20 * numberOfLilligantInPlay;
      }

    }

    return state;
  }
}