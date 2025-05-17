import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, CardTarget, PlayerType, PokemonCardList, ChoosePokemonPrompt, GameMessage, SlotType, HealEffect } from "@ptcg/common";

export class Smoliv extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Nutrients',
    cost: [CardType.GRASS],
    damage: 0,
    text: ' Heal 30 damage from 1 of your Pokémon. '
  },
  {
    name: 'Spray Fluid',
    cost: [CardType.GRASS, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];

  public set: string = 'SVI';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public fullName: string = 'Smoliv SVI';
  public name: string = 'Smoliv';
  public setNumber: string = '21';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const blocked: CardTarget[] = [];
      let hasPokemonWithDamage: boolean = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage === 0) {
          blocked.push(target);
        } else {
          hasPokemonWithDamage = true;
        }
      });

      if (hasPokemonWithDamage === false) {
        return state;
      }

      // Do not discard the card yet
      effect.preventDefault = true;

      let targets: PokemonCardList[] = [];
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false, blocked }
      ), results => {
        targets = results || [];
        if (targets.length === 0) {
          return state;
        }

        targets.forEach(target => {
          // Heal Pokemon
          const healEffect = new HealEffect(player, target, 30);
          store.reduceEffect(state, healEffect);
        });
        return state;
      });


    }

    return state;
  }
}