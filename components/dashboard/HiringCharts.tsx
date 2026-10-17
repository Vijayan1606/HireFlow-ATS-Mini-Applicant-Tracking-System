'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  Cell,
} from 'recharts';
import { Candidate, DashboardStats, CANDIDATE_STAGES } from '@/types/candidate';

interface HiringChartsProps {
  candidates: Candidate[];
  stats: DashboardStats | null;
  isLoading?: boolean;
}

const STAGE_BAR_COLORS: Record<string, string> = {
  Applied: '#64748b',    // Slate
  Screening: '#f59e0b',  // Amber
  Interview: '#8b5cf6',  // Purple
  Offer: '#6366f1',      // Indigo
  Hired: '#10b981',      // Emerald
};

export const HiringCharts: React.FC<HiringChartsProps> = ({
  candidates,
  stats,
  isLoading = false,
}) => {
  // Prepare Stage Distribution data
  const stageData = React.useMemo(() => {
    return CANDIDATE_STAGES.map((s) => ({
      stage: s.label,
      count: stats?.stageCounts?.[s.value] || 0,
      color: STAGE_BAR_COLORS[s.value] || '#4f46e5',
    }));
  }, [stats]);

  // Prepare Applications Timeline Data
  const timelineData = React.useMemo(() => {
    if (!candidates || candidates.length === 0) return [];

    // Group candidates by day of application
    const map: Record<string, number> = {};
    const sorted = [...candidates].sort(
      (a, b) => new Date(a.applied_at).getTime() - new Date(b.applied_at).getTime()
    );

    sorted.forEach((c) => {
      const d = new Date(c.applied_at);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      map[label] = (map[label] || 0) + 1;
    });

    return Object.entries(map).map(([date, applications]) => ({
      date,
      applications,
    }));
  }, [candidates]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-72 rounded-2xl bg-white border border-slate-200/80 p-5 animate-pulse" />
        <div className="h-72 rounded-2xl bg-white border border-slate-200/80 p-5 animate-pulse" />
      </div>
    );
  }

  const hasData = candidates.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Chart 1: Pipeline Stage Distribution */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900 tracking-tight">
              Recruitment Pipeline Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Active candidate volume by recruitment stage
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
            {stats?.total ?? 0} Total
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="stage"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl bg-slate-900 p-2.5 text-xs text-white shadow-lg border border-slate-800">
                          <p className="font-semibold">{data.stage}</p>
                          <p className="text-slate-300 mt-0.5">
                            {data.count} {data.count === 1 ? 'candidate' : 'candidates'}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No candidates in pipeline to display
            </div>
          )}
        </div>
      </div>

      {/* Chart 2: Application Velocity Timeline */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900 tracking-tight">
              Application Intake & Activity
            </h3>
            <p className="text-xs text-slate-500">
              Incoming candidate volume over recent timeline
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            Recent Intake
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          {hasData && timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl bg-slate-900 p-2.5 text-xs text-white shadow-lg border border-slate-800">
                          <p className="font-semibold">{data.date}</p>
                          <p className="text-indigo-300 mt-0.5">
                            {data.applications} {data.applications === 1 ? 'application' : 'applications'}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#appGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No application history to plot
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
