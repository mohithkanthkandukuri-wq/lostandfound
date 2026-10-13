import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useItems } from '../context/ItemsContext';
import { ItemCard } from '../components/items/ItemCard';
import { ItemListItem } from '../components/items/ItemListItem';
import { ItemFilters } from '../components/items/ItemFilters';
import { Button } from '../components/common/Button';
import {
  Compass,
  PlusCircle,
  HelpCircle,
  SearchX,
  Sparkles,
  Loader2
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export const BrowseItemsPage = ({ onOpenReportModal, onViewItemDetails, onOpenClaim }) => {
  const { items } = useItems();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Sync
  const queryParamSearch = searchParams.get('search') || '';
  const queryParamType = searchParams.get('type') || 'ALL';
  const queryParamCategory = searchParams.get('category') || '';
  const queryParamLocation = searchParams.get('location') || '';

  // Local Filter States
  const [searchQuery, setSearchQuery] = useState(queryParamSearch);
  const [reportType, setReportType] = useState(queryParamType);
  const [selectedCategory, setSelectedCategory] = useState(queryParamCategory);
  const [selectedLocation, setSelectedLocation] = useState(queryParamLocation);
  const [dateRange, setDateRange] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    if (queryParamSearch !== searchQuery) setSearchQuery(queryParamSearch);
    if (queryParamType !== reportType) setReportType(queryParamType);
    if (queryParamCategory !== selectedCategory) setSelectedCategory(queryParamCategory);
    if (queryParamLocation !== selectedLocation) setSelectedLocation(queryParamLocation);
  }, [queryParamSearch, queryParamType, queryParamCategory, queryParamLocation]);

  // Handle URL updates
  const updateUrlParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'ALL') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    updateUrlParam('search', val);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleReportTypeChange = (type) => {
    setReportType(type);
    updateUrlParam('type', type);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    updateUrlParam('category', cat);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleLocationChange = (loc) => {
    setSelectedLocation(loc);
    updateUrlParam('location', loc);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setReportType('ALL');
    setSelectedCategory('');
    setSelectedLocation('');
    setDateRange('ALL');
    setSortBy('NEWEST');
    setSearchParams({});
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // Filter & Sort Logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesLocation = item.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesLocation) {
          return false;
        }
      }

      // 2. Report Type (LOST vs FOUND)
      if (reportType !== 'ALL' && item.reportType !== reportType) {
        return false;
      }

      // 3. Category
      if (selectedCategory && item.category !== selectedCategory) {
        return false;
      }

      // 4. Location
      if (selectedLocation && item.location !== selectedLocation) {
        return false;
      }

      // 5. Date Range
      if (dateRange !== 'ALL') {
        const itemDate = new Date(item.incidentDate);
        const now = new Date();
        const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);

        if (dateRange === 'TODAY' && diffDays > 1) return false;
        if (dateRange === 'PAST_3_DAYS' && diffDays > 3) return false;
        if (dateRange === 'PAST_WEEK' && diffDays > 7) return false;
        if (dateRange === 'PAST_MONTH' && diffDays > 30) return false;
      }

      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.incidentDate).getTime();
      const dateB = new Date(b.incidentDate).getTime();
      return sortBy === 'NEWEST' ? dateB - dateA : dateA - dateB;
    });
  }, [items, searchQuery, reportType, selectedCategory, selectedLocation, dateRange, sortBy]);

  const displayedItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Lost & Found Directory
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Search active listings, submit claims, or report an item you lost or found on campus.
          </p>
        </div>

        <button
          onClick={() => onOpenReportModal()}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-soft transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report an Item</span>
        </button>
      </div>

      {/* Filter Component */}
      <ItemFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        reportType={reportType}
        onReportTypeChange={handleReportTypeChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={handleResetFilters}
        totalResults={filteredItems.length}
      />

      {/* Items Rendering */}
      {filteredItems.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-xl mx-auto shadow-soft my-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <SearchX className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Matching Items Found</h3>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            We couldn't find any listings matching your current filter criteria. Try adjusting your search keywords, category, or campus location.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="secondary" onClick={handleResetFilters} size="sm">
              Clear All Filters
            </Button>
            <Button
              variant="primary"
              onClick={() => onOpenReportModal('LOST')}
              size="sm"
              icon={PlusCircle}
            >
              Report This As Lost
            </Button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onViewDetails={onViewItemDetails}
              onClaim={onOpenClaim}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {displayedItems.map((item) => (
            <ItemListItem
              key={item.id}
              item={item}
              onViewDetails={onViewItemDetails}
              onClaim={onOpenClaim}
            />
          ))}
        </div>
      )}

      {/* Load More Pagination */}
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm shadow-soft hover:shadow-soft-md transition inline-flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Loading more items...</span>
              </>
            ) : (
              <span>Load More Listings ({filteredItems.length - visibleCount} remaining)</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
