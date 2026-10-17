'use client';

import React from 'react';
import Link from 'next/link';
import { Candidate, DashboardStats, CANDIDATE_STAGES } from '@/types/candidate';
import { formatRelativeTime } from '@/lib/utils/formatters';
import { CheckCircle2, Calendar, FileText, ArrowRight, UserPlus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RecentActivityProps {
  candidates: Candidate[];
  stats: DashboardStats | null;
  onOpenAddModal: () => void;
  isLoading?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  candidates,
  stats,
  onOpenAddModal,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs animate-pulse h-96" />
    );
  }

  // Derive activity items dynamically from actual candidate records
  const activities = React.useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      description: string;
      time: string;
      icon: any;
      iconBg: string;
      iconColor: string;
    }> = [];

    // Filter candidates in various stages to construct a realistic activity log
    candidates.slice(0, 6).forEach((c) => {
      if (c.stage === 'Hired') {
        list.push({
          id: `hired-${c.id}`,
          title: `${c.full_name} moved to Hired`,
          description: `Offer signed for ${c.position}`,
          time: formatRelativeTime(c.updated_at),
          icon: CheckCircle2,
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-700',
        });
      } else if (c.stage === 'Offer') {
        list.push({
          id: `offer-${c.id}`,
          title: `Offer extended to ${c.full_name}`,
          description: `${c.position} (${c.experience_years} yrs exp)`,
          time: formatRelativeTime(c.updated_at),
          icon: Sparkles,
          iconBg: 'bg-indigo-100',
          iconColor: 'text-indigo-700',
        });
      } else if (c.stage === 'Interview') {
        list.push({
          id: `int-${c.id}`,
          title: `Interview conducted for ${c.full_name}`,
          description: c.notes ? c.notes.slice(0, 50) + '...' : `Stage updated for ${c.position}`,
          time: formatRelativeTime(c.updated_at),
          icon: Calendar,
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-700',
        });
      } else {
        list.push({
          id: `app-${c.id}`,
          title: `New application: ${c.full_name}`,
          description: `Applied for ${c.position}`,
          time: formatRelativeTime(c.applied_at),
          icon: UserPlus,
          iconBg: 'bg-slate-100',
          iconColor: 'text-slate-700',
        });
      }
    });

    return list.slice(0, 5);
  }, [candidates]);

  const total = stats?.total || 0;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900 tracking-tight">
              Recruitment Activity Feed
            </h3>
            <p className="text-xs text-slate-500">
              Live updates across candidate pipelines
            </p>
          </div>

          <Link
            href="/pipeline"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>Kanban Board</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Pipeline Progress Breakdown */}
        {total > 0 && (
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">Pipeline Progression</span>
              <span className="text-slate-500 font-medium">{stats?.hired || 0} of {total} Hired</span>
            </div>
            {/* Multi-stage progress bar */}
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden flex">
              <div
                style={{ width: `${((stats?.applied || 0) / total) * 100}%` }}
                className="bg-slate-400"
                title={`Applied: ${stats?.applied || 0}`}
              />
              <div
                style={{ width: `${((stats?.screening || 0) / total) * 100}%` }}
                className="bg-amber-400"
                title={`Screening: ${stats?.screening || 0}`}
              />
              <div
                style={{ width: `${((stats?.interview || 0) / total) * 100}%` }}
                className="bg-purple-500"
                title={`Interview: ${stats?.interview || 0}`}
              />
              <div
                style={{ width: `${((stats?.offer || 0) / total) * 100}%` }}
                className="bg-indigo-500"
                title={`Offer: ${stats?.offer || 0}`}
              />
              <div
                style={{ width: `${((stats?.hired || 0) / total) * 100}%` }}
                className="bg-emerald-500"
                title={`Hired: ${stats?.hired || 0}`}
              />
            </div>
          </div>
        )}

        {/* Activity Items */}
        <div className="divide-y divide-slate-100 mt-2">
          {activities.length > 0 ? (
            activities.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="py-2.5 flex items-start gap-3">
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${item.iconBg} ${item.iconColor}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                    {item.time}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No recent recruitment events recorded.
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 mt-2">
        <Link
          href="/pipeline"
          className="w-full inline-flex justify-center items-center py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
        >
          Open Hiring Pipeline
        </Link>
      </div>
    </div>
  );
};
