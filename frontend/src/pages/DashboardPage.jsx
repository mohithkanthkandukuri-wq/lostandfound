import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemsContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  LayoutDashboard,
  Search,
  PlusCircle,
  FileCheck2,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  ExternalLink
} from 'lucide-react';

export const DashboardPage = ({
  onOpenReportModal,
  onViewItemDetails,
  onOpenReviewClaim,
  onOpenClaim
}) => {
  const { currentUser } = useAuth();
  const {
    items,
    claims,
    getUserReportedItems,
    getUserClaims,
    markAsReturned,
    deleteItem,
    cancelClaim
  } = useItems();

  const [activeTab, setActiveTab] = useState('reported'); // 'reported' | 'my_claims' | 'claims_received'
  const [tableSearch, setTableSearch] = useState('');

  const currentUserId = currentUser ? currentUser.id : 1;

  // Reported items by this user
  const myReportedItems = useMemo(
    () => getUserReportedItems(currentUserId),
    [items, currentUserId]
  );

  // Claims submitted by this user
  const myClaims = useMemo(
    () => getUserClaims(currentUserId),
    [claims, currentUserId]
  );

  // Claims received on items reported by this user
  const claimsReceived = useMemo(() => {
    const reportedItemIds = myReportedItems.map((i) => i.id);
    return claims.filter((c) => reportedItemIds.includes(c.itemId));
  }, [myReportedItems, claims]);

  // Counts for KPI summary cards
  const myLostCount = myReportedItems.filter((i) => i.reportType === 'LOST').length;
  const myFoundCount = myReportedItems.filter((i) => i.reportType === 'FOUND').length;
  const pendingClaimsCount = myClaims.filter((c) => c.status === 'PENDING').length;
  const recoveriesCount = myReportedItems.filter((i) => i.status === 'RESOLVED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 1. WELCOME HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-50 border border-slate-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome back, {currentUser?.name || 'Student Alex'}
              </h1>
              <Badge variant={currentUser?.role === 'ADMIN' ? 'ADMIN' : 'USER'} size="xs">
                {currentUser?.role === 'ADMIN' ? 'Security Admin' : 'Student'}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {currentUser?.email} • ID: <span className="font-mono">{currentUser?.studentId}</span> • {currentUser?.department}
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenReportModal('LOST')}
            icon={PlusCircle}
          >
            Report Lost Item
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onOpenReportModal('FOUND')}
            icon={PlusCircle}
          >
            Report Found Item
          </Button>
        </div>
      </div>

      {/* 2. SUMMARY CARDS (4 KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">My Lost Items</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
              L
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{myLostCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Active lost reports</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">My Found Items</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              F
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{myFoundCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Items turned in</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Claims</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              ?
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {pendingClaimsCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting verification</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Recoveries</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
              ✓
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {recoveriesCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Successfully returned</p>
        </div>
      </div>

      {/* 3. TABBED ACTIVITY CONTENT */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        {/* Navigation Tabs */}
        <div className="border-b border-slate-200/80 px-6 pt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('reported')}
              className={`pb-4 px-2 text-sm font-bold border-b-2 transition ${
                activeTab === 'reported'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              My Reported Items ({myReportedItems.length})
            </button>

            <button
              onClick={() => setActiveTab('my_claims')}
              className={`pb-4 px-2 text-sm font-bold border-b-2 transition ${
                activeTab === 'my_claims'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              My Submitted Claims ({myClaims.length})
            </button>

            <button
              onClick={() => setActiveTab('claims_received')}
              className={`pb-4 px-2 text-sm font-bold border-b-2 transition ${
                activeTab === 'claims_received'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Claims Received on My Items ({claimsReceived.length})
            </button>
          </div>

          {/* Quick Table Search */}
          <div className="relative pb-4">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search table..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Tab 1: My Reported Items */}
        {activeTab === 'reported' && (
          <div className="p-6">
            {myReportedItems.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-3">
                <p className="text-sm">You haven't reported any lost or found items yet.</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onOpenReportModal()}
                  icon={PlusCircle}
                >
                  Create Your First Report
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                      <th className="pb-3 pl-2">Item</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Location</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Claims</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myReportedItems
                      .filter((i) =>
                        tableSearch
                          ? i.title.toLowerCase().includes(tableSearch.toLowerCase())
                          : true
                      )
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-4 pl-2 font-semibold text-slate-900 max-w-xs truncate">
                            {item.title}
                          </td>
                          <td className="py-4">
                            <Badge variant={item.reportType} size="xs">
                              {item.reportType}
                            </Badge>
                          </td>
                          <td className="py-4 text-slate-600">{item.category}</td>
                          <td className="py-4 text-slate-600 truncate max-w-[150px]">
                            {item.location}
                          </td>
                          <td className="py-4">
                            <Badge variant={item.status} size="xs">
                              {item.status === 'RESOLVED' ? 'REUNITED' : 'ACTIVE'}
                            </Badge>
                          </td>
                          <td className="py-4 font-semibold text-slate-700">
                            {item.claimsCount || 0}
                          </td>
                          <td className="py-4 text-right pr-2">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onViewItemDetails(item)}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                                title="View details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {item.status === 'OPEN' && (
                                <button
                                  onClick={() => markAsReturned(item.id)}
                                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                                  title="Mark item as recovered"
                                >
                                  Mark Returned
                                </button>
                              )}

                              <button
                                onClick={() => deleteItem(item.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Delete listing"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Submitted Claims */}
        {activeTab === 'my_claims' && (
          <div className="p-6">
            {myClaims.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-3">
                <p className="text-sm">You haven't submitted any ownership claims yet.</p>
                <Link
                  to="/items?type=FOUND"
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:underline"
                >
                  Browse Found Listings to find your belongings
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                      <th className="pb-3 pl-2">Claimed Item</th>
                      <th className="pb-3">Proof Provided</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Review Feedback</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myClaims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 pl-2 font-semibold text-slate-900 max-w-xs truncate">
                          {claim.itemTitle}
                        </td>
                        <td className="py-4 text-slate-600 max-w-sm truncate italic">
                          "{claim.message}"
                        </td>
                        <td className="py-4">
                          <Badge variant={claim.status} size="xs">
                            {claim.status}
                          </Badge>
                        </td>
                        <td className="py-4 text-slate-600 text-xs">
                          {claim.reviewMessage || (
                            <span className="text-slate-400">Awaiting desk review</span>
                          )}
                        </td>
                        <td className="py-4 text-right pr-2">
                          {claim.status === 'PENDING' ? (
                            <button
                              onClick={() => cancelClaim(claim.id)}
                              className="px-2.5 py-1 text-xs font-medium rounded-lg text-rose-600 hover:bg-rose-50 transition border border-rose-200"
                            >
                              Cancel Claim
                            </button>
                          ) : claim.status === 'APPROVED' ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Pickup
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Closed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Claims Received on My Items */}
        {activeTab === 'claims_received' && (
          <div className="p-6">
            {claimsReceived.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p className="text-sm">No claims have been submitted on your found listings yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                      <th className="pb-3 pl-2">Item</th>
                      <th className="pb-3">Claimant</th>
                      <th className="pb-3">Proof Summary</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {claimsReceived.map((claim) => (
                      <tr key={claim.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 pl-2 font-semibold text-slate-900 max-w-xs truncate">
                          {claim.itemTitle}
                        </td>
                        <td className="py-4 text-slate-800 font-medium">
                          {claim.claimantName}
                        </td>
                        <td className="py-4 text-slate-600 max-w-xs truncate italic">
                          "{claim.message}"
                        </td>
                        <td className="py-4">
                          <Badge variant={claim.status} size="xs">
                            {claim.status}
                          </Badge>
                        </td>
                        <td className="py-4 text-right pr-2">
                          <button
                            onClick={() => onOpenReviewClaim(claim)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition"
                          >
                            Review Claim
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
