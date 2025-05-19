import { GamePhase } from '../store';
import { Rank } from './rank.enum';
import { PlayerStats } from '../game/player-stats';

export interface PlayerInfo {
  clientId: number;
  name: string;
  prizes: number;
  deck: number;
}

export interface GameInfo {
  gameId: number;
  phase: GamePhase;
  turn: number;
  activePlayer: number;
  players: PlayerInfo[];
}

export interface ClientInfo {
  clientId: number;
  userId: number;
}

export interface CoreInfo {
  clientId: number;
  clients: ClientInfo[];
  users: UserInfo[];
  games: GameInfo[];
}

export interface GameState {
  gameId: number;
  stateData: string;
  clientIds: number[];
  timeLimit: number;
  recordingEnabled: boolean;
  playerStats: PlayerStats[];
}

export interface UserInfo {
  connected: boolean;
  userId: number;
  name: string;
  email: string;
  ranking: number;
  rank: Rank;
  registered: number;
  lastRankingChange: number;
  avatarFile: string;
}
