'use client';

import React, { useState } from 'react';
import { AppShell, useATS } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import {
  Database,
  Sparkles,
  Trash2,
  Copy,
  User,
} from 'lucide-react';

function SettingsContent() {
  const { isLiveDb, refreshData, candidates } = useATS();
  const { success, error } = useToast();

  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const res = await fetch('/api/seed', { method: 'POST' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to seed sample data');
      }
      success('Database Seeded', json.message || 'Sample candidates loaded.');
      await refreshData();
    } catch (err: any) {
      error('Seed Error', err.message || 'Could not populate sample data.');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to clear all candidate records? This allows testing the empty state.')) {
      return;
    }

    try {
      setIsClearing(true);
      const res = await fetch('/api/seed', { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to clear data');
      }
      success('Data Cleared', 'All candidate records have been removed.');
      await refreshData();
    } catch (err: any) {
      error('Clear Error', err.message || 'Could not clear candidates.');
    } finally {
      setIsClearing(false);
    }
  };

  const copyEnvSample = () => {
    const text = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`;
    navigator.clipboard.writeText(text);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Database Connection Status Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Supabase PostgreSQL Connection
              </h3>
              <p className="text-xs text-slate-500">
                Status of your cloud database and credentials
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${
              isLiveDb
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-1.5 ${
                isLiveDb ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'
              }`}
            />
            {isLiveDb ? 'Connected (Live Supabase)' : 'Demo Store Active'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isLiveDb
            ? 'HireFlow ATS is actively communicating with your Supabase PostgreSQL instance. All candidate records, stage movements, and edits are persisted in your cloud database.'
            : 'HireFlow ATS is currently running with an in-memory development store pre-populated with realistic candidates. To connect your live Supabase project, simply configure your .env.local file with your Supabase credentials.'}
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Environment Variables (.env.local)</span>
            <button
              onClick={copyEnvSample}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedEnv ? 'Copied!' : 'Copy template'}
            </button>
          </div>
          <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto font-mono">
            NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co{'\n'}
            NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
          </pre>
        </div>
      </div>

      {/* Sample Data & Testing Actions */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Sample Data Management
            </h3>
            <p className="text-xs text-slate-500">
              Populate or clear candidate records to verify pipeline states and metrics
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Currently displaying <strong className="font-semibold text-slate-900">{candidates.length}</strong> candidates in the recruitment system.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            variant="primary"
            onClick={handleSeedData}
            isLoading={isSeeding}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Sparkles className="h-4 w-4 mr-1.5" />
            Load 15 Sample Candidates
          </Button>

          <Button
            variant="outline"
            onClick={handleClearData}
            isLoading={isClearing}
            className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Clear All Candidate Records
          </Button>
        </div>
      </div>

      {/* Demonstration Recruiter Profile */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Recruiter Profile
            </h3>
            <p className="text-xs text-slate-500">
              Active recruiter session in demonstration mode
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block text-xs">Name</span>
            <span className="font-semibold text-slate-800">Sarah Jenkins</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block text-xs">Role</span>
            <span className="font-semibold text-slate-800">Lead Technical Recruiter</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block text-xs">Email</span>
            <span className="font-semibold text-slate-800">sarah.jenkins@hireflow.internal</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block text-xs">Company</span>
            <span className="font-semibold text-slate-800">EarlyJobs.ai Recruitment</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AppShell
      headerTitle="Settings & Configuration"
      headerSubtitle="Manage database connections, seed data, and application environment"
    >
      <SettingsContent />
    </AppShell>
  );
}
