import { StoreLike, State, Effect, AttackEffect, CardTag, CardType, PokemonCard, Stage, GameWinner, GamePhase } from '@ptcg/common';

export class NsSigilyph extends PokemonCard {
  public tags = [CardTag.NS];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 110;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Psy Sphere',
    cost: [P],
    damage: 20,
    text: ''
  },
  {
    name: 'Victory Sigil',
    cost: [P, C, C],
    damage: 0,
    text: 'If you have exactly 1 Prize card remaining when using this attack, you win this game.'
  }];

  public regulationMark = 'I';
  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'N\'s Sigilyph';
  public fullName: string = 'N\'s Sigilyph JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      if (player.prizes.length === 1) {
        const winner = player.id === state.players[0].id ? GameWinner.PLAYER_1 : GameWinner.PLAYER_2;
        state.winner = winner;
        state.phase = GamePhase.FINISHED;
        return state;
      }
    }
    return state;
  }
}