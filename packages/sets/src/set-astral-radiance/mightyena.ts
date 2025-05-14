import { StoreLike, State, Effect, AttackEffect, CardTag, CardType, CheckAttackCostEffect, DealDamageEffect, PlayerType, PokemonCard, PowerEffect, PowerType, Stage, StateUtils } from '@ptcg/common';

export class Mightyena extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Poochyena';

  public cardType: CardType = CardType.DARK;

  public hp: number = 110;

  public weakness = [{ type: CardType.GRASS }];

  public resistance = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Hustle Bark',
    powerType: PowerType.ABILITY,
    text: 'If your opponent has any Pokémon VMAX in play, this Pokémon\'s attacks cost [C][C][C] less.'
  }];

  public attacks = [{
    name: 'Wild Tackle',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 160,
    text: 'This Pokémon also does 50 damage to itself.'
  }];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '96';

  public name: string = 'Mightyena';

  public fullName: string = 'Mightyena ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        console.log(effect.cost);
        return state;
      }

      const opponent = StateUtils.getOpponent(state, effect.player);

      let hasVmaxPokemon = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        const pokemonCard = cardList.getPokemonCard();
        if (pokemonCard && pokemonCard.tags.includes(CardTag.POKEMON_VMAX)) {
          hasVmaxPokemon = true;
        }
      });

      if (hasVmaxPokemon) {

        const costToRemove = 3;

        for (let i = 0; i < costToRemove; i++) {
          const index = effect.cost.indexOf(CardType.COLORLESS);
          if (index !== -1) {
            effect.cost.splice(index, 1);
          }
        }
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 50);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}
