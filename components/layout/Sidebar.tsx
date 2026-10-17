'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Kanban,
  Settings,
  Sparkles,
  Database,
  Layers,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isLiveDb?: boolean;
  onOpenAddModal?: () => void;
}

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Candidates',
    href: '/candidates',
    icon: Users,
  },
  {
    name: 'Hiring Pipeline',
    href: '/pipeline',
    icon: Kanban,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
  isLiveDb = false,
  onOpenAddModal,
}) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xs group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base">HireFlow</span>
              <span className="ml-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">ATS</span>
            </div>
          </Link>

          {/* Close button on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Quick Action */}
        <div className="px-4 pt-5 pb-2">
          <button
            onClick={() => {
              if (onOpenAddModal) onOpenAddModal();
              if (onClose) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm py-2.5 px-4 shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Add Candidate</span>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href === '/dashboard' && pathname === '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  )}
                />
                <span>{item.name}</span>
                {item.name === 'Hiring Pipeline' && (
                  <span className="ml-auto text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-medium">
                    Kanban
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Database Status Card */}
        <div className="p-4 border-t border-slate-100">
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-indigo-600" />
                <span className="text-xs font-semibold text-slate-800">Database</span>
              </div>
              <span
                className={cn(
                  'inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border',
                  isLiveDb
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                )}
              >
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full mr-1',
                    isLiveDb ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'
                  )}
                />
                {isLiveDb ? 'Supabase Live' : 'Demo Active'}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500 leading-tight">
              {isLiveDb
                ? 'Connected to your Supabase PostgreSQL database.'
                : 'Interactive demo store ready. Add Supabase keys to sync.'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
