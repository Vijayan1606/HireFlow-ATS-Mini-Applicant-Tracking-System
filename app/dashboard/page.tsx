'use client';

import React, { useState, useEffect } from 'react';
import { AppShell, useATS } from '@/components/layout/AppShell';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { HiringCharts } from '@/components/dashboard/HiringCharts';
import { RecentCandidates } from '@/components/dashboard/RecentCandidates';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { DashboardStats } from '@/types/candidate';
import { Button } from '@/components/ui/Button';
import { Plus, Sparkles, RefreshCw, Database } from 'lucide-react';
import Link from 'next/link';

function DashboardView() {
  const { candidates, isLoading, openAddModal, openDetailModal, refreshData } = useATS();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await fetch('/api/stats');
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [candidates]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refreshData(), fetchStats()]);
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Recruitment Dashboard
            </h2>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full">
              Live Overview
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time pipeline metrics, hiring velocity, and candidate activities.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            isLoading={isRefreshing}
            className="flex-1 sm:flex-initial"
          >
            <RefreshCw className="h-4 w-4 mr-1 text-slate-500" />
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={openAddModal}
            className="flex-1 sm:flex-initial"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* 6 Core Dashboard Metrics */}
      <MetricsCards stats={stats} isLoading={isLoading || statsLoading} />

      {/* Visual Analytics Charts */}
      <HiringCharts
        candidates={candidates}
        stats={stats}
        isLoading={isLoading || statsLoading}
      />

      {/* Bottom Grid: Recent Candidates & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCandidates
          candidates={candidates}
          onViewCandidate={openDetailModal}
          onOpenAddModal={openAddModal}
          isLoading={isLoading}
        />

        <RecentActivity
          candidates={candidates}
          stats={stats}
          onOpenAddModal={openAddModal}
          isLoading={isLoading || statsLoading}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppShell
      headerTitle="Recruiter Dashboard"
      headerSubtitle="Pipeline health and candidate activity metrics"
    >
      <DashboardView />
    </AppShell>
  );
}
