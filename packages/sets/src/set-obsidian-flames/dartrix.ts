import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, PutDamageEffect } from "@ptcg/common";

export class Dartrix extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Rowlet';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Shoot Through',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 40,
      text: 'This attack does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public regulationMark = 'H';

  public set: string = 'OBF';

  public setNumber: string = '14';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Dartrix';

  public fullName: string = 'Dartrix OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shoot Through
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
}