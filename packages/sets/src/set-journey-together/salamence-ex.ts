import { StoreLike, State, Effect, AttackEffect, Card, CardTag, CardType, CheckProvidedEnergyEffect, ChooseEnergyPrompt, DiscardCardsEffect, EnergyCard, GameMessage, PlayerType, PokemonCard, PutDamageEffect, Stage, StateUtils } from '@ptcg/common';

export class Salamenceex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Shelgon';
  public cardType: CardType = N;
  public hp: number = 320;
  public retreat = [C, C];

  public attacks = [{
      name: 'Wide Blast',
      cost: [R, C, C],
      damage: 0,
      text: 'This attack does 50 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Dragon Impact',
      cost: [R, W, C, C],
      damage: 300,
      text: 'Discard 2 Energy from this Pokémon.'
    }];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '114';
  public name: string = 'Salamence ex';
  public fullName: string = 'Salamence ex JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Wide Blast
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList !== opponent.active) {
          const damageEffect = new PutDamageEffect(effect, 50);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    // Dragon Impact
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      if (!player.active.cards.some(c => c instanceof EnergyCard)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [C, C],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }

    return state;
  }
}
