import { TrainerCard, TrainerType, StoreLike, State, Effect, UseStadiumEffect, StateUtils, GameError, GameMessage, AttachEnergyEffect, CheckPokemonTypeEffect, Stage, CardType, GameLog } from "@ptcg/common";

export class CalamitousSnowyMountain extends TrainerCard {

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '174';

  public trainerType = TrainerType.STADIUM;

  public set = 'PAL';

  public name = 'Calamitous Snowy Mountain';

  public fullName = 'Calamitous Snowy Mountain PAL';

  public text = 'Whenever any player attaches an Energy card from their hand to 1 of their Basic non-[W] Pokémon, put 2 damage counters on that Pokémon.';

  reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    if (effect instanceof AttachEnergyEffect && StateUtils.getStadiumCard(state) === this) {

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonTypeEffect);

      if (!effect.target.isStage(Stage.BASIC) || checkPokemonTypeEffect.cardTypes.includes(CardType.WATER)) {
        return state;
      }

      const owner = StateUtils.findOwner(state, effect.target);
      store.log(state, GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS, { name: owner.name, damage: 20, target: effect.target.getPokemonCard()!.name, effect: this.name });
      effect.target.damage += 20;
    }

    return state;
  }

}