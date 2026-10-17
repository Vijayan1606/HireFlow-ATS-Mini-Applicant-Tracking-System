'use client';

import React from 'react';
import { DashboardStats, CandidateStage } from '@/types/candidate';
import {
  Users,
  Inbox,
  UserCheck,
  CalendarCheck,
  Gift,
  Trophy,
  ArrowUpRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

interface MetricsCardsProps {
  stats: DashboardStats | null;
  isLoading?: boolean;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ stats, isLoading = false }) => {
  const router = useRouter();

  const total = stats?.total || 0;

  const cards = [
    {
      title: 'Total Candidates',
      count: stats?.total ?? 0,
      stage: 'All' as const,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
      description: 'Active talent pool',
    },
    {
      title: 'Applied',
      count: stats?.applied ?? 0,
      stage: 'Applied' as CandidateStage,
      icon: Inbox,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      description: total > 0 ? `${Math.round(((stats?.applied ?? 0) / total) * 100)}% of pipeline` : '0%',
    },
    {
      title: 'In Screening',
      count: stats?.screening ?? 0,
      stage: 'Screening' as CandidateStage,
      icon: UserCheck,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200/80',
      description: total > 0 ? `${Math.round(((stats?.screening ?? 0) / total) * 100)}% of pipeline` : '0%',
    },
    {
      title: 'Interviews',
      count: stats?.interview ?? 0,
      stage: 'Interview' as CandidateStage,
      icon: CalendarCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200/80',
      description: total > 0 ? `${Math.round(((stats?.interview ?? 0) / total) * 100)}% of pipeline` : '0%',
    },
    {
      title: 'Offers',
      count: stats?.offer ?? 0,
      stage: 'Offer' as CandidateStage,
      icon: Gift,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200/80',
      description: total > 0 ? `${Math.round(((stats?.offer ?? 0) / total) * 100)}% of pipeline` : '0%',
    },
    {
      title: 'Hired',
      count: stats?.hired ?? 0,
      stage: 'Hired' as CandidateStage,
      icon: Trophy,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200/80',
      description: total > 0 ? `${Math.round(((stats?.hired ?? 0) / total) * 100)}% hired` : '0%',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-white border border-slate-200/80 p-4 animate-pulse flex flex-col justify-between"
          >
            <div className="h-4 w-16 bg-slate-200 rounded" />
            <div className="h-7 w-12 bg-slate-200 rounded" />
            <div className="h-3 w-20 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            onClick={() => {
              if (card.stage === 'All') {
                router.push('/candidates');
              } else {
                router.push(`/candidates?stage=${card.stage}`);
              }
            }}
            className={cn(
              'group relative rounded-2xl bg-white p-4 border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5',
              card.borderColor
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 truncate">
                {card.title}
              </span>
              <div
                className={cn(
                  'h-7 w-7 rounded-lg flex items-center justify-center transition-colors',
                  card.bgColor,
                  card.color
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {card.count}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
            </div>

            <p className="mt-1.5 text-[11px] font-medium text-slate-400 truncate">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};
