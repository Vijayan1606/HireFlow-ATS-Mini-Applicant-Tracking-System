'use client';

import React, { useState, useMemo } from 'react';
import { Candidate, CandidateStage, CANDIDATE_STAGES } from '@/types/candidate';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatRelativeTime, getInitials } from '@/lib/utils/formatters';
import {
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Users,
} from 'lucide-react';

interface CandidatesTableProps {
  candidates: Candidate[];
  onViewCandidate: (candidate: Candidate) => void;
  onEditCandidate: (candidate: Candidate) => void;
  onDeleteCandidate: (candidate: Candidate) => void;
  onStageChange: (candidateId: string, stage: CandidateStage) => void;
  onOpenAddModal: () => void;
}

type SortField = 'name' | 'applied_at' | 'experience' | 'stage';
type SortOrder = 'asc' | 'desc';

export const CandidatesTable: React.FC<CandidatesTableProps> = ({
  candidates,
  onViewCandidate,
  onEditCandidate,
  onDeleteCandidate,
  onStageChange,
  onOpenAddModal,
}) => {
  // Search and Filter states
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedPosition, setSelectedPosition] = useState<string>('All');
  const [selectedExpRange, setSelectedExpRange] = useState<string>('All');

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('applied_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Extract unique positions for filter dropdown
  const uniquePositions = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => {
      if (c.position) set.add(c.position);
    });
    return Array.from(set).sort();
  }, [candidates]);

  // Filtering and Sorting logic
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      // Search filter
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const matchesName = c.full_name.toLowerCase().includes(query);
        const matchesEmail = c.email.toLowerCase().includes(query);
        const matchesPosition = c.position.toLowerCase().includes(query);
        const matchesSkills = c.skills?.some((s) => s.toLowerCase().includes(query));
        if (!matchesName && !matchesEmail && !matchesPosition && !matchesSkills) {
          return false;
        }
      }

      // Stage filter
      if (selectedStage !== 'All' && c.stage !== selectedStage) {
        return false;
      }

      // Position filter
      if (selectedPosition !== 'All' && c.position !== selectedPosition) {
        return false;
      }

      // Experience filter
      if (selectedExpRange !== 'All') {
        const exp = Number(c.experience_years) || 0;
        if (selectedExpRange === '0-2' && exp > 2) return false;
        if (selectedExpRange === '3-5' && (exp < 3 || exp > 5)) return false;
        if (selectedExpRange === '6+' && exp < 6) return false;
      }

      return true;
    });
  }, [candidates, search, selectedStage, selectedPosition, selectedExpRange]);

  const sortedCandidates = useMemo(() => {
    const list = [...filteredCandidates];
    list.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.full_name.localeCompare(b.full_name);
      } else if (sortField === 'experience') {
        comparison = (a.experience_years || 0) - (b.experience_years || 0);
      } else if (sortField === 'stage') {
        comparison = a.stage.localeCompare(b.stage);
      } else {
        comparison = new Date(a.applied_at).getTime() - new Date(b.applied_at).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return list;
  }, [filteredCandidates, sortField, sortOrder]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedCandidates.length / pageSize));
  const paginatedCandidates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCandidates.slice(start, start + pageSize);
  }, [sortedCandidates, currentPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedStage('All');
    setSelectedPosition('All');
    setSelectedExpRange('All');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedStage !== 'All' ||
    selectedPosition !== 'All' ||
    selectedExpRange !== 'All';

  // Export to CSV
  const exportToCsv = () => {
    const headers = ['Full Name', 'Email', 'Phone', 'Position', 'Experience (Years)', 'Stage', 'Skills', 'Applied Date'];
    const rows = sortedCandidates.map((c) => [
      `"${c.full_name.replace(/"/g, '""')}"`,
      `"${c.email.replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      `"${c.position.replace(/"/g, '""')}"`,
      c.experience_years,
      c.stage,
      `"${(c.skills || []).join(', ')}"`,
      c.applied_at,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hireflow-candidates-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search, Filters, CSV Export */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by candidate name, email, position, or skill..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Quick Export action */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCsv}
              disabled={sortedCandidates.length === 0}
              title="Export filtered candidates to CSV"
            >
              <Download className="h-4 w-4 mr-1.5 text-slate-500" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filter Dropdowns row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>Filter by:</span>
          </div>

          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) => {
              setSelectedStage(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white py-1.5 px-2.5 text-xs text-slate-700 focus:border-indigo-600 focus:outline-none cursor-pointer"
          >
            <option value="All">All Stages</option>
            {CANDIDATE_STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Position Filter */}
          <select
            value={selectedPosition}
            onChange={(e) => {
              setSelectedPosition(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white py-1.5 px-2.5 text-xs text-slate-700 focus:border-indigo-600 focus:outline-none cursor-pointer max-w-[200px]"
          >
            <option value="All">All Positions</option>
            {uniquePositions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>

          {/* Experience Filter */}
          <select
            value={selectedExpRange}
            onChange={(e) => {
              setSelectedExpRange(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white py-1.5 px-2.5 text-xs text-slate-700 focus:border-indigo-600 focus:outline-none cursor-pointer"
          >
            <option value="All">All Experience</option>
            <option value="0-2">0 - 2 Years</option>
            <option value="3-5">3 - 5 Years</option>
            <option value="6+">6+ Years</option>
          </select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium ml-auto cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Candidates Table Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-slate-800 cursor-pointer"
                  >
                    <span>Candidate</span>
                    {sortField === 'name' ? (
                      sortOrder === 'asc' ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-40" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Skills</th>
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort('experience')}
                    className="flex items-center gap-1 hover:text-slate-800 cursor-pointer"
                  >
                    <span>Experience</span>
                    {sortField === 'experience' ? (
                      sortOrder === 'asc' ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-40" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort('applied_at')}
                    className="flex items-center gap-1 hover:text-slate-800 cursor-pointer"
                  >
                    <span>Application Date</span>
                    {sortField === 'applied_at' ? (
                      sortOrder === 'asc' ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-40" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">
                  <button
                    onClick={() => handleSort('stage')}
                    className="flex items-center gap-1 hover:text-slate-800 cursor-pointer"
                  >
                    <span>Hiring Stage</span>
                    {sortField === 'stage' ? (
                      sortOrder === 'asc' ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-40" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedCandidates.length > 0 ? (
                paginatedCandidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Candidate Name & Avatar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600/90 to-violet-600/90 text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {getInitials(candidate.full_name)}
                        </div>
                        <div>
                          <button
                            onClick={() => onViewCandidate(candidate)}
                            className="font-semibold text-slate-900 hover:text-indigo-600 text-left transition-colors cursor-pointer"
                          >
                            {candidate.full_name}
                          </button>
                          {candidate.phone && (
                            <p className="text-[11px] text-slate-400">{candidate.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4">
                      <span className="text-slate-600 text-xs sm:text-sm font-mono truncate max-w-[180px] inline-block">
                        {candidate.email}
                      </span>
                    </td>

                    {/* Position */}
                    <td className="py-3 px-4">
                      <span className="text-slate-800 font-medium text-xs sm:text-sm">
                        {candidate.position}
                      </span>
                    </td>

                    {/* Skills */}
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills && candidate.skills.length > 0 ? (
                          candidate.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="skill" size="sm">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                        {candidate.skills && candidate.skills.length > 3 && (
                          <span className="text-[10px] text-slate-500 font-medium self-center bg-slate-100 px-1 rounded">
                            +{candidate.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Experience */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                        {candidate.experience_years} {candidate.experience_years === 1 ? 'yr' : 'yrs'}
                      </span>
                    </td>

                    {/* Application Date */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-xs text-slate-700 font-medium">
                        {formatDate(candidate.applied_at)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {formatRelativeTime(candidate.applied_at)}
                      </div>
                    </td>

                    {/* Stage selector dropdown */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={candidate.stage}
                        onChange={(e) => onStageChange(candidate.id, e.target.value as CandidateStage)}
                        className="rounded-lg border border-slate-200 bg-white py-1 px-2 text-xs font-semibold text-slate-800 shadow-2xs hover:border-indigo-400 focus:border-indigo-600 focus:outline-none cursor-pointer"
                      >
                        {CANDIDATE_STAGES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewCandidate(candidate)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="View profile"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEditCandidate(candidate)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="Edit candidate"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteCandidate(candidate)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete candidate"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                        <Users className="h-6 w-6" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800">
                        {hasActiveFilters ? 'No matching candidates found' : 'No candidates registered yet'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {hasActiveFilters
                          ? 'Try adjusting or clearing your search and filters to view candidate records.'
                          : 'Get started by creating your first applicant record.'}
                      </p>
                      <div className="pt-2 flex justify-center gap-2">
                        {hasActiveFilters ? (
                          <Button variant="outline" size="sm" onClick={clearAllFilters}>
                            Clear Filters
                          </Button>
                        ) : (
                          <Button variant="primary" size="sm" onClick={onOpenAddModal}>
                            Add Candidate
                          </Button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-50/60 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800 font-semibold">{sortedCandidates.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-slate-800 font-semibold">{Math.min(currentPage * pageSize, sortedCandidates.length)}</strong> of{' '}
            <strong className="text-slate-800 font-semibold">{sortedCandidates.length}</strong> candidates
            {candidates.length !== sortedCandidates.length && ` (filtered from ${candidates.length} total)`}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="h-8 px-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <span className="font-medium text-slate-700 px-1">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="h-8 px-2"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
