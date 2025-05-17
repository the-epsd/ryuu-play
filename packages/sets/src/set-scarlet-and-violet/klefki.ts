import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, Effect, PowerEffect, StateUtils, GameError, GameMessage, AttackEffect, MOVE_CARDS, ChooseCardsPrompt, TrainerType } from "@ptcg/common";

export class Klefki extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Mischievous Lock',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, Basic ' +
      'Pokémon in play (both yours and your opponent\'s) have no ' +
      'Abilities, except for Mischievous Lock.'
  }];

  public attacks = [{
    name: 'Joust',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: 'Before doing damage, discard all Pokémon Tools from your opponent\'s Active Pokémon.'
  }];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '96';

  public name: string = 'Klefki';

  public fullName: string = 'Klefki SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY && effect.power.name !== 'Mischievous Lock') {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Klefki is not active Pokemon
      if (player.active.getPokemonCard() !== this
        && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      // We are not blocking the Abilities from Non-Basic Pokemon
      if (effect.card.stage !== Stage.BASIC) {
        return state;
      }

      // Try reducing ability for each player  
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }
      if (!effect.power.exemptFromAbilityLock) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Discard active Pokemon's tool first
      const activePokemon = opponent.active;
      if (activePokemon.tools && activePokemon.tools.length > 0) {
        if (activePokemon.tools.length > 1) {
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            activePokemon,
            { trainerType: TrainerType.TOOL },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            MOVE_CARDS(store, state, activePokemon, opponent.discard, { cards: selected });
            activePokemon.tools = activePokemon.tools.filter(tool => !selected.includes(tool));
          });
        } else {
          MOVE_CARDS(store, state, activePokemon, opponent.discard, { cards: activePokemon.tools });
          activePokemon.tools = [];
        }
      }

      // Then deal damage
      effect.damage = 10;

      return state;
    }
    return state;
  }
}