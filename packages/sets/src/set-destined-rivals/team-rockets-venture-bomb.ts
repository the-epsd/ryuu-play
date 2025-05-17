import { TrainerCard, TrainerType, CardTag, StoreLike, State, Effect, TrainerEffect, COIN_FLIP_PROMPT, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from "@ptcg/common";

export class TeamRocketsVentureBomb extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public tags = [CardTag.TEAM_ROCKET];
  public set: string = 'SV10';
  public regulationMark = 'I';
  public name: string = 'Team Rocket\'s Venture Bomb';
  public fullName: string = 'Team Rocket\'s Venture Bomb SV10';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';

  public text: string = 'Flip a coin. If heads, put 2 damage counters on 1 of your opponent\'s Pokémon. If tails, put 2 damage counters on your Active Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      COIN_FLIP_PROMPT(store, state, player, result => {
          
        if (result){
          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
            PlayerType.TOP_PLAYER,
            [ SlotType.ACTIVE, SlotType.BENCH ],
            { min: 1, max: 1, allowCancel: false },
          ), selected => {
            const targets = selected || [];
            targets.forEach(target => {
              target.damage += 20;
            });
          });
        }

        if (!result){
          player.active.damage += 20;
          return state;
        }

      });

      player.supporter.moveTo(player.discard);

      return state;
    }

    return state;
  }

}
