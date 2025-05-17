import { PokemonCard, CardTag, Stage, CardType, StoreLike, State, Effect, AttackEffect, StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, PutDamageEffect } from "@ptcg/common";

export class WoChienex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex];

  public stage = Stage.BASIC;

  public cardType = CardType.GRASS;

  public hp = 230;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Covetous Ivy',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 60 damage to 1 of your opponent\'s Benched Pokémon for each Prize card your opponent has taken. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Forest Blast',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: 220,
      text: ''
    }
  ];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '27';

  public name: string = 'Wo-Chien ex';

  public fullName: string = 'Wo-Chien ex PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        return state;
      }

      const damagePerPrize = 60;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, damagePerPrize * opponent.prizesTaken);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state;
      });
    }
    return state;
  }
}
