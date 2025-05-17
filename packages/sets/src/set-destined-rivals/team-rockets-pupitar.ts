import { StoreLike, State, AttackEffect, Card, ChooseCardsPrompt, GameMessage, SuperType, Stage, SHUFFLE_DECK, PokemonCard, CardTag, CardType, Effect, WAS_ATTACK_USED } from "@ptcg/common";

function* useExplosiveAwakening(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_EVOLVE,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.STAGE_2, evolvesFrom: 'Team Rocket\'s Pupitar'},
    { min: 1, max: 1, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > 0) {
    // Evolve Pokemon
    player.deck.moveCardsTo(cards, player.active);
    player.active.clearEffects();
    player.active.pokemonPlayedTurn = state.turn;
  }

  SHUFFLE_DECK(store, state, player);
}

export class TeamRocketsPupitar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Team Rocket\'s Larvitar';
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Explosive Awakening',
      cost: [ C ],
      damage: 30,
      text: 'Search your deck for a card that evolves from this Pokémon and put it onto this Pokémon to evolve it. Then, shuffle your deck.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Pupitar';
  public fullName: string = 'Team Rocket\'s Pupitar SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const generator = useExplosiveAwakening(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
