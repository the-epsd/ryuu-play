import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, AttackEffect, PlayerType, PutDamageEffect, StateUtils } from "@ptcg/common";

export class Tyranitarex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Pupitar';
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public cardType: CardType = L;
  public hp: number = 340;
  public weakness = [{ type: F }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Mountain Hurl',
      cost: [F],
      damage: 120,
      text: 'Discard the top 2 cards of your deck.'
    },
    {
      name: 'Lightning Rampage',
      cost: [F, F],
      damage: 150,
      damageCalculation: '+',
      text: 'If your Benched Pokémon have any damage counters on them, this attack does 100 more damage.'
    },

  ];

  public set: string = 'OBF';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Tyranitar ex';
  public fullName: string = 'Tyranitar ex OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mountain Hurl
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      player.deck.moveTo(player.discard, 2);
    }

    // Lightning Rampage
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      // checking if this pokemon is in play
      let isThereDamage = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList === player.active) {
          return;
        }
        if (cardList.damage > 0) {
          isThereDamage = true;
        }
      });
      if (isThereDamage) {
        effect.damage += 100;
      }
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}