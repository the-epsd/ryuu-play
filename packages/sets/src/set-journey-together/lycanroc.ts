import { StoreLike, State, Effect, AttachEnergyPrompt, Attack, CardType, ConfirmPrompt, EvolveEffect, GameMessage, PlayerType, PokemonCard, Power, PowerEffect, PowerType, SlotType, Stage, StateUtils, SuperType, WAS_ATTACK_USED } from '@ptcg/common';

export class Lycanroc extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Rockruff';
  public regulationMark = 'I';
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C, C];

  public powers: Power[] = [{
    name: 'Spike Cloak',
    powerType: PowerType.ABILITY,
    text: 'You may use this Ability when you play this Pokémon from your hand to evolve 1 of your Pokémon. ' +
      'Attach up to 2 Spiky Energy cards from your discard pile to this Pokémon.'
  }];

  public attacks: Attack[] = [
    {
      name: 'Clutch Fang',
      cost: [C, C, C],
      damage: 40,
      damageCalculation: '+',
      text: 'This attack does 40 more damage for each damage counter on your opponent\'s Active Pokémon.'
    },
  ];

  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name: string = 'Lycanroc';
  public fullName: string = 'Lycanroc JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if ((effect instanceof EvolveEffect) && effect.pokemonCard === this) {
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
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
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          const player = effect.player;
          return store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_CARDS,
            player.discard,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH, SlotType.ACTIVE],
            { superType: SuperType.ENERGY, name: 'Spiky Energy' },
            { allowCancel: false, min: 0, max: 2 },
          ), transfers => {
            transfers = transfers || [];
            // cancelled by user
            if (transfers.length === 0) {
              return state;
            }
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              player.discard.moveCardTo(transfer.card, target);
            }
          });
        }
        return state;
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.damage > 0)
        effect.damage += (opponent.active.damage * 4);
    }
    return state;
  }
}