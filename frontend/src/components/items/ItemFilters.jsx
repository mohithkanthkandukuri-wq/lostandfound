import React from 'react';
import { CATEGORIES } from '../../data/categories';
import { CAMPUS_LOCATIONS } from '../../data/locations';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  RotateCcw,
  Calendar,
  MapPin,
  Tag,
  ArrowUpDown
} from 'lucide-react';

export const ItemFilters = ({
  searchQuery,
  onSearchChange,
  reportType,
  onReportTypeChange,
  selectedCategory,
  onCategoryChange,
  selectedLocation,
  onLocationChange,
  dateRange,
  onDateRangeChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  totalResults
}) => {
  const hasActiveFilters =
    Boolean(searchQuery) ||
    reportType !== 'ALL' ||
    Boolean(selectedCategory) ||
    Boolean(selectedLocation) ||
    dateRange !== 'ALL' ||
    sortBy !== 'NEWEST';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-4 sm:p-6 mb-8 space-y-4">
      {/* Top row: Search input, Type Pills, Grid/List view toggle */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by keyword, item title, or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Report Type Tabs: All / Lost / Found */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl self-start lg:self-auto">
          {[
            { id: 'ALL', label: 'All Items' },
            { id: 'LOST', label: 'Lost Only' },
            { id: 'FOUND', label: 'Found Only' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onReportTypeChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                reportType === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid vs List toggle */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-lg transition ${
              viewMode === 'grid'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-lg transition ${
              viewMode === 'list'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Second row: Dropdowns for Category, Location, Date Range, Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
        {/* Category Dropdown */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-indigo-500" /> Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location Dropdown */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-indigo-500" /> Campus Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer truncate"
          >
            <option value="">All Campus Locations</option>
            {CAMPUS_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Dropdown */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-indigo-500" /> Date Reported
          </label>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">Any Time</option>
            <option value="TODAY">Today Only</option>
            <option value="PAST_3_DAYS">Past 3 Days</option>
            <option value="PAST_WEEK">Past 7 Days</option>
            <option value="PAST_MONTH">Past 30 Days</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-indigo-500" /> Sort Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips & Reset Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-500">
        <div>
          Showing <span className="font-bold text-slate-800">{totalResults}</span> items matching your criteria
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-indigo-600 hover:bg-indigo-50 font-medium transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
