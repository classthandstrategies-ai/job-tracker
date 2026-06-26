import { useMemo } from 'react';
import StatCard from './StatCard';
import { computeStats } from '../selectors/stats';

/**
 * The dashboard band: brand wordmark + a 4-up row of pipeline metrics derived
 * from the full (unfiltered) application list.
 */
export default function DashboardHeader({ applications }) {
  const stats = useMemo(() => computeStats(applications), [applications]);

  return (
    <header className="border-b border-hairline bg-canvas">
      <div className="mx-auto max-w-[1200px] px-6 pt-10 pb-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[1.5px] text-muted">
              <span className="spike-mark text-primary" /> Job Tracker
            </p>
            <h1 className="font-display text-[48px] leading-[1.05] text-ink">
              Your application pipeline
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Active applications"
            value={stats.active}
            hint={`of ${stats.total} total`}
            accent
          />
          <StatCard
            label="Response rate"
            value={stats.responseRate}
            suffix="%"
            hint="drew any employer response"
          />
          <StatCard
            label="Interview conversion"
            value={stats.interviewRate}
            suffix="%"
            hint="of responses reached interview"
          />
          <StatCard
            label="Applied this week"
            value={stats.thisWeek}
            hint="in the last 7 days"
          />
        </div>
      </div>
    </header>
  );
}
