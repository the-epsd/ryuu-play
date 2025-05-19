import { LessThan } from 'typeorm';
import { Match } from '../../storage';
import { Scheduler } from '../../utils';
import { config } from '../../config';

export class CleanerTask {
  public startTasks() {
    this.startOldMatchDelete();
  }

  private startOldMatchDelete() {
    const scheduler = Scheduler.getInstance();
    scheduler.run(async () => {
      const keepMatchTime = config.core.keepMatchTime;
      const today = Date.now();
      const yesterday = today - keepMatchTime;
      await Match.delete({ created: LessThan(yesterday) });
    }, config.core.keepMatchIntervalCount);
  }
}
