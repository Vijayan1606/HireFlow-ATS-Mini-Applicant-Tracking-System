import React from 'react';
import { cn } from '@/lib/utils/cn';
import { CandidateStage } from '@/types/candidate';
import { getStageConfig } from '@/lib/utils/formatters';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'stage' | 'skill';
  stage?: CandidateStage;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  children,
  variant = 'default',
  stage,
  size = 'md',
  ...props
}) => {
  if (variant === 'stage' && stage) {
    const config = getStageConfig(stage);
    return (
      <span
        className={cn(
          'inline-flex items-center font-medium rounded-full border transition-colors',
          config.bg,
          config.border,
          config.text,
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
          className
        )}
        {...props}
      >
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full mr-1.5',
            stage === 'Applied' && 'bg-slate-400',
            stage === 'Screening' && 'bg-amber-500',
            stage === 'Interview' && 'bg-purple-500',
            stage === 'Offer' && 'bg-indigo-500',
            stage === 'Hired' && 'bg-emerald-500'
          )}
        />
        {config.label}
      </span>
    );
  }

  if (variant === 'skill') {
    return (
      <span
        className={cn(
          'inline-flex items-center font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 hover:bg-slate-200/70 transition-colors',
          size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-xs',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
