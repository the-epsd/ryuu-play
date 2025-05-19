export enum Rank {
  NOVICE_I = 'NOVICE_I',
  NOVICE_II = 'NOVICE_II',
  NOVICE_III = 'NOVICE_III',
  APPRENTICE_I = 'APPRENTICE_I',
  APPRENTICE_II = 'APPRENTICE_II',
  APPRENTICE_III = 'APPRENTICE_III',
  CHALLENGER_I = 'CHALLENGER_I',
  CHALLENGER_II = 'CHALLENGER_II',
  CHALLENGER_III = 'CHALLENGER_III',
  ACE_I = 'ACE_I',
  ACE_II = 'ACE_II',
  ACE_III = 'ACE_III',
  LEGEND_I = 'LEGEND_I',
  LEGEND_II = 'LEGEND_II',
  LEGEND_III = 'LEGEND_III',
  MYTHIC = 'MYTHIC'
}

export interface RankLevel {
  points: number;
  rank: Rank;
}

export const rankLevels: RankLevel[] = [
  { points: 0, rank: Rank.NOVICE_I },
  { points: 100, rank: Rank.NOVICE_II },
  { points: 200, rank: Rank.NOVICE_III },
  { points: 300, rank: Rank.APPRENTICE_I },
  { points: 400, rank: Rank.APPRENTICE_II },
  { points: 500, rank: Rank.APPRENTICE_III },
  { points: 600, rank: Rank.CHALLENGER_I },
  { points: 700, rank: Rank.CHALLENGER_II },
  { points: 800, rank: Rank.CHALLENGER_III },
  { points: 900, rank: Rank.ACE_I },
  { points: 1000, rank: Rank.ACE_II },
  { points: 1100, rank: Rank.ACE_III },
  { points: 1200, rank: Rank.LEGEND_I },
  { points: 1300, rank: Rank.LEGEND_II },
  { points: 1400, rank: Rank.LEGEND_III },
  { points: 1500, rank: Rank.MYTHIC }
];
