import { PokemonCard, Stage, CardType, CardTag, PowerType, StoreLike, State, Effect, WAS_ATTACK_USED, ADD_CONFUSION_TO_PLAYER_ACTIVE } from '@ptcg/common';


export class ArceusPsychic extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C];
  public tags = [CardTag.ARCEUS];

  public powers = [{
    name: 'Arceus Rule',
    powerType: PowerType.ARCEUS_RULE,
    text: 'You may have as many of this card in your deck as you like.'
  }];

  public attacks = [
    {
      name: 'Mind Bend',
      cost: [P, C, C],
      damage: 40,
      text: 'The Defending Pokémon is now Confused.'
    }
  ];

  public set: string = 'AR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'AR7';
  public name: string = 'Arceus';
  public fullName: string = 'Arceus Psychic AR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Mind Bend
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}