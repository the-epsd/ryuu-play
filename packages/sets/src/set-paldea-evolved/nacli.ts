import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, HealTargetEffect } from "@ptcg/common";

export class Nacli extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Salt Coating',
    cost: [F],
    damage: 0,
    text: 'Heal 20 damage from 1 of your Pokémon.'
  },
  {
    name: 'Slashing Strike',
    cost: [F, F],
    damage: 30,
    text: ''
  }];

  public set: string = 'PAL';
  public name: string = 'Nacli';
  public fullName: string = 'Nacli PAL';
  public setNumber: string = '121';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Salt Coating
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      return store.prompt(state, new ChoosePokemonPrompt(
        effect.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const healEffect = new HealTargetEffect(effect, 20);
        healEffect.target = targets[0];
        store.reduceEffect(state, healEffect);
      });
    }
    
    return state;
  }
}