import { Action } from '../actions/action';
import { State, GamePhase, GameWinner } from '../state/state';
import { GameError } from '../../game-error';
import { GameMessage, GameLog } from '../../game-message';
import { StoreLike } from '../store-like';
import { AbortGameAction, AbortGameReason } from '../actions/abort-game-action';
import { endGame } from '../effect-reducers/check-effect';
import { StateUtils } from '../state-utils';


export function abortGameReducer(store: StoreLike, state: State, action: Action): State {

  if (state.phase !== GamePhase.FINISHED && action instanceof AbortGameAction) {

    const culprit = state.players.find(p => p.id === action.culpritId);
    if (culprit === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    // Mark all prompts as resolved, so they won't mess with our state anymore.
    state.prompts.forEach(prompt => {
      if (prompt.result === undefined) {
        prompt.result = null;
      }
    });

    // Explain why game was aborted
    switch (action.reason) {
      case AbortGameReason.TIME_ELAPSED:
        store.log(state, GameLog.LOG_TIME_ELAPSED, { name: culprit.name });
        break;
      case AbortGameReason.ILLEGAL_MOVES:
        store.log(state, GameLog.LOG_BANNED_BY_ARBITER, { name: culprit.name });
        break;
      case AbortGameReason.DISCONNECTED:
        store.log(state, GameLog.LOG_PLAYER_LEFT_THE_GAME, { name: culprit.name });
        break;
    }

    // Game has not started, no winner
    if (state.phase === GamePhase.WAITING_FOR_PLAYERS || state.phase === GamePhase.SETUP) {
      store.log(state, GameLog.LOG_GAME_FINISHED_BEFORE_STARTED);
      state.phase = GamePhase.FINISHED;
      state.winner = GameWinner.NONE;
      return state;
    }

    // Let's decide who wins.
    const opponent = StateUtils.getOpponent(state, culprit);

    // The remaining player always wins
    const winner = opponent === state.players[0]
      ? GameWinner.PLAYER_1
      : GameWinner.PLAYER_2;
    state = endGame(store, state, winner);
  }

  return state;
}
