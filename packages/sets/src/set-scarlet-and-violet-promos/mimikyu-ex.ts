import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, AttackEffect, StateUtils, CheckProvidedEnergyEffect, EndTurnEffect, ConfirmPrompt, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType } from "@ptcg/common";

export class Mimikyuex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex];

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 190;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Void Return',
    cost: [CardType.PSYCHIC],
    damage: 30,
    text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
  }, {
    name: 'Energy Burst',
    cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage for each Energy attached to both Active Pokémon.'
  }];

  public set: string = 'SVP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '4';

  public name: string = 'Mimikyu ex';

  public fullName: string = 'Mimikyu ex SVP';

  public voidReturn: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {


    // Energy Burst
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const playerProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, playerProvidedEnergy);
      const playerEnergyCount = playerProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      const opponentProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, opponentProvidedEnergy);
      const opponentEnergyCount = opponentProvidedEnergy.energyMap
        .reduce((left, p) => left + p.provides.length, 0);

      effect.damage = (playerEnergyCount + opponentEnergyCount) * 30;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      this.voidReturn = true;
    }

    if (effect instanceof EndTurnEffect && this.voidReturn == true) {
      const player = effect.player;
      const hasBenched = player.bench.some(b => b.cards.length > 0);

      if (!hasBenched) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_SWITCH_POKEMON,
      ), wantToUse => {
        if (wantToUse) {

          return state = store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false },
          ), selected => {
            if (!selected || selected.length === 0) {
              return state;
            }
            const target = selected[0];
            player.switchPokemon(target);
            this.voidReturn = false;
          });
        }
      });
    }
    return state;
  }
}