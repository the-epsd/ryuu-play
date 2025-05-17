import { PokemonCard, Stage, CardType, StoreLike, State, Effect, AttackEffect, StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, PutDamageEffect } from "@ptcg/common";

export class Pupitar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Larvitar';
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Rock Throw',
      cost: [ F ],
      damage: 20,
      text: '',
    },
    {
      name: 'Blasting Tackle',
      cost: [ F, F ],
      damage: 60,
      text: 'This attack also does 20 damage to 1 of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)',
    },
    
  ];

  public regulationMark = 'G';
  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';
  public name: string = 'Pupitar';
  public fullName: string = 'Pupitar OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Blasting Tackle
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]){
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