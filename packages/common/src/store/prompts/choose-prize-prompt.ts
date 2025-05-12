import { CardList } from '../state/card-list';
import { Prompt } from './prompt';
import { State } from '../state/state';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';

export const ChoosePrizePromptType = 'Choose prize';

export interface ChoosePrizeOptions {
  isSecret: boolean;
  count: number;
  max: number;
  blocked: number[];
  useOpponentPrizes: boolean;
  allowCancel: boolean;
  destination?: CardList;
}

export class ChoosePrizePrompt extends Prompt<CardList[]> {

  readonly type: string = ChoosePrizePromptType;

  public options: ChoosePrizeOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    options?: Partial<ChoosePrizeOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      count: 1,
      max: 1,
      blocked: [],
      allowCancel: false,
      isSecret: false,
      useOpponentPrizes: false
    }, options);

    this.options.max = this.options.count;

  }

  public decode(result: number[] | null, state: State): CardList[] | null {
    if (result === null) {
      return result;
    }
    const player = state.players.find(p => p.id === this.playerId);
    if (player === undefined) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }

    const targetPlayer = this.options.useOpponentPrizes
      ? state.players.find(p => p.id !== this.playerId)
      : player;

    if (targetPlayer === undefined) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }

    const prizes = targetPlayer.prizes.filter(p => p.cards.length > 0);
    return result.map(index => prizes[index]);
  }

  public validate(result: CardList[] | null): boolean {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (result.length !== this.options.count) {
      return false;
    }
    const hasDuplicates = result.some((p, index) => {
      return result.indexOf(p) !== index;
    });
    if (hasDuplicates) {
      return false;
    }
    const hasEmpty = result.some(p => p.cards.length === 0);
    if (hasEmpty) {
      return false;
    }
    return true;
  }
}