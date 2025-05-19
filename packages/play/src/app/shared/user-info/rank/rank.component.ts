import { Component, Input } from '@angular/core';
import { Rank } from '@ptcg/common';

@Component({
  selector: 'ptcg-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.scss']
})
export class RankComponent {

  @Input() set rank(rank: Rank) {
    switch (rank) {
      // Novice ranks - Blue
      case Rank.NOVICE_I:
      case Rank.NOVICE_II:
      case Rank.NOVICE_III:
        this.rankColor = 'primary';
        this.rankName = `USERS_RANK_${rank}`;
        break;
      // Apprentice ranks - Green
      case Rank.APPRENTICE_I:
      case Rank.APPRENTICE_II:
      case Rank.APPRENTICE_III:
        this.rankColor = 'accent';
        this.rankName = `USERS_RANK_${rank}`;
        break;
      // Challenger ranks - Orange
      case Rank.CHALLENGER_I:
      case Rank.CHALLENGER_II:
      case Rank.CHALLENGER_III:
        this.rankColor = 'warn';
        this.rankName = `USERS_RANK_${rank}`;
        break;
      // Ace ranks - Purple
      case Rank.ACE_I:
      case Rank.ACE_II:
      case Rank.ACE_III:
        this.rankColor = 'primary';
        this.rankName = `USERS_RANK_${rank}`;
        break;
      // Legend ranks - Gold
      case Rank.LEGEND_I:
      case Rank.LEGEND_II:
      case Rank.LEGEND_III:
        this.rankColor = 'accent';
        this.rankName = `USERS_RANK_${rank}`;
        break;
      // Mythic rank - Red
      case Rank.MYTHIC:
        this.rankColor = 'warn';
        this.rankName = 'USERS_RANK_MYTHIC';
        break;
      default:
        this.rankColor = '';
        this.rankName = 'USERS_RANK_UNKNOWN';
    }
  }

  @Input() ranking: number;
  public rankName: string;
  public rankColor: string;

  constructor() { }

}
