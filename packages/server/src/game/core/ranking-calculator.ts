import { User, Match } from '../../storage';
import { MoreThan, LessThan, In } from 'typeorm';
import { GameWinner } from '@ptcg/common';
import { Rank, rankLevels } from '@ptcg/common';
import { config } from '../../config';

export class RankingCalculator {

  constructor() { }

  public calculateMatch(match: Match): User[] {
    const player1 = match.player1;
    const player2 = match.player2;

    if (player1.id === player2.id) {
      return [];
    }

    const rank1 = player1.getRank();
    const rank2 = player2.getRank();

    // Base kValue is now 20 for wins, 12 for losses
    const kValue = 20;
    const totalDiff = player2.ranking - player1.ranking;
    const diff = Math.max(-400, Math.min(400, totalDiff));
    const winExp = 1.0 / (1 + Math.pow(10.0, diff / 400.0));
    let outcome: number;
    let rankMultipier1: number = 1;
    let rankMultipier2: number = 1;

    switch (match.winner) {
      case GameWinner.PLAYER_1:
        outcome = 1;
        rankMultipier1 = this.getRankMultipier(rank1);
        break;
      case GameWinner.PLAYER_2:
        rankMultipier2 = this.getRankMultipier(rank2);
        outcome = 0;
        break;
      default:
      case GameWinner.DRAW:
        outcome = 0.5;
        break;
    }

    const stake = kValue * (outcome - winExp);
    const diff1 = this.getRankingDiff(rank1, rank2, Math.round(stake * rankMultipier1), true);
    const diff2 = this.getRankingDiff(rank2, rank1, Math.round(stake * rankMultipier2), false);

    // Apply the ranking changes
    const newRanking1 = Math.max(0, player1.ranking + diff1);
    const newRanking2 = Math.max(0, player2.ranking + diff2);

    // Check if the new ranking would drop a player below their current rank's minimum
    const finalRanking1 = this.protectRankThreshold(player1.ranking, newRanking1, rank1);
    const finalRanking2 = this.protectRankThreshold(player2.ranking, newRanking2, rank2);

    player1.ranking = finalRanking1;
    player2.ranking = finalRanking2;

    const today = Date.now();
    player1.lastRankingChange = today;
    player2.lastRankingChange = today;

    return [player1, player2];
  }

  private getRankingDiff(rank1: Rank, rank2: Rank, diff: number, isWinner: boolean): number {
    // For Mythic rank, use fixed values
    if (rank1 === Rank.MYTHIC) {
      return isWinner ? 20 : -20;
    }

    // For Novice ranks, don't lose points on loss
    if (!isWinner && (rank1 === Rank.NOVICE_I || rank1 === Rank.NOVICE_II || rank1 === Rank.NOVICE_III)) {
      return 0;
    }

    // For losses, use 12 as base kValue instead of 20
    if (!isWinner) {
      diff = (diff / 20) * 12;
    }

    const sign = diff >= 0;
    let value = Math.abs(diff);

    // Maximum ranking change for different ranks = 10
    if (rank1 !== rank2 && value > 10) {
      value = 10;
    }

    // Minimum ranking change = 5
    if (value < 5) {
      value = 5;
    }

    return sign ? value : -value;
  }

  private protectRankThreshold(currentRanking: number, newRanking: number, currentRank: Rank): number {
    // Get the minimum points needed for the current rank
    const rankLevel = rankLevels.find(level => level.rank === currentRank);
    if (!rankLevel) return newRanking;

    // If the new ranking would be below the current rank's minimum, set it to the minimum
    if (newRanking < rankLevel.points) {
      return rankLevel.points;
    }

    return newRanking;
  }

  private getRankMultipier(rank: Rank): number {
    switch (rank) {
      // Novice ranks - Easier to gain points
      case Rank.NOVICE_I:
      case Rank.NOVICE_II:
      case Rank.NOVICE_III:
        return 2.0;

      // Apprentice ranks - Still relatively easy to gain points
      case Rank.APPRENTICE_I:
      case Rank.APPRENTICE_II:
      case Rank.APPRENTICE_III:
        return 1.0;

      // Challenger ranks - Moderate difficulty
      case Rank.CHALLENGER_I:
      case Rank.CHALLENGER_II:
      case Rank.CHALLENGER_III:
        return 1.0;

      // Ace ranks - Getting harder
      case Rank.ACE_I:
      case Rank.ACE_II:
      case Rank.ACE_III:
        return 1.0;

      // Legend ranks - Much harder
      case Rank.LEGEND_I:
      case Rank.LEGEND_II:
      case Rank.LEGEND_III:
        return 1.0;

      // Mythic - Hardest to gain points
      case Rank.MYTHIC:
        return 1.0;

      default:
        return 1.0;
    }
  }

  public async decreaseRanking(): Promise<User[]> {
    const rankingDecraseRate = config.core.rankingDecraseRate;
    const oneDay = config.core.rankingDecraseTime;
    const today = Date.now();
    const yesterday = today - oneDay;

    // Find all users who haven't played in a day
    const users = await User.find({
      where: {
        lastRankingChange: LessThan(yesterday),
        ranking: MoreThan(0)
      }
    });

    // Filter to only include Mythic rank players
    const mythicUsers = users.filter(user => user.getRank() === Rank.MYTHIC);

    // calculate new ranking in the server
    mythicUsers.forEach(user => {
      user.lastRankingChange = today;
      user.ranking = Math.floor(user.ranking * rankingDecraseRate);
    });

    // execute update query in the database only for Mythic users
    if (mythicUsers.length > 0) {
      await User.update({
        id: In(mythicUsers.map(user => user.id)),
        lastRankingChange: LessThan(yesterday),
        ranking: MoreThan(0)
      }, {
        lastRankingChange: today,
        ranking: () => `ROUND(${rankingDecraseRate} * ranking - 0.5)`
      });
    }

    return mythicUsers;
  }

}
