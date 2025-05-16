import { StoreLike, State, Effect, AttackEffect, Card, CardTag, CardType, CheckProvidedEnergyEffect, ChoosePokemonPrompt, DiscardCardsEffect, EnergyCard, EnergyType, GameMessage, PlayerType, PokemonCard, PutDamageEffect, SlotType, Stage, StateUtils } from '@ptcg/common';

export class NsDarmanitan extends PokemonCard {

  public tags = [CardTag.NS];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'N\'s Darumaka';

  public cardType: CardType = R;

  public weakness = [{ type: W }];

  public hp: number = 140;

  public retreat = [C, C, C];

  public attacks = [{
    name: 'Backdraft',
    cost: [C, C],
    damage: 30,
    text: 'This attack does 30 damage for each Basic Energy card in your opponent\'s discard pile.'
  },
  {
    name: 'Darman-i-cannon',
    cost: [R, R, C],
    damage: 90,
    text: 'Discard all Energy from this Pokémon. This attack also does 90 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public regulationMark = 'I';

  public cardImage: string = 'assets/cardback.png';

  public set: string = 'JTG';

  public setNumber = '27';

  public name: string = 'N\'s Darmanitan';

  public fullName: string = 'N\'s Darmanitan JTG';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let energyCount = 0;
      opponent.discard.cards.forEach(c => {
        if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
          energyCount += 1;
        }
      });

      effect.damage = energyCount * 30;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);

      const max = Math.min(1);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: max, max, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 90);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
      });
    }
    return state;
  }
}