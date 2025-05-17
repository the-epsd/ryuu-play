import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, Effect, WAS_ATTACK_USED, ChooseCardsPrompt, GameMessage } from "@ptcg/common";

export class TeamRocketsChingling extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = P;
  public hp: number = 30;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [ ];

  public attacks = [
    {
      name: 'Ring Ring Noise',
      cost: [ ],
      damage: 0,
      text: 'Discard a random card from your opponent\'s hand.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '41';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Chingling';
  public fullName: string = 'Team Rocket\'s Chingling SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;
      const opponent = effect.opponent;

      if (opponent.hand.cards.length === 0){
        return state;
      }

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        {},
        { allowCancel: false, min: 1, max: 1, isSecret: true }
      ), cards => {
        cards = cards || [];

        opponent.hand.moveCardsTo(cards, opponent.discard);
      });
    }

    return state;
  }
}
