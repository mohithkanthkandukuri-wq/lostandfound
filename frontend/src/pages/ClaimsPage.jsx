import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemsContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  QrCode,
  MapPin,
  Calendar,
  AlertCircle,
  Eye
} from 'lucide-react';

export const ClaimsPage = ({ onOpenReviewClaim, onViewItemDetails }) => {
  const { currentUser, isAdmin } = useAuth();
  const { claims, items, cancelClaim, getItemById } = useItems();
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Filter claims
  const filteredClaims = claims.filter((claim) => {
    if (filterStatus !== 'ALL' && claim.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ownership Verification & Claim Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Claims Management
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Review ownership evidence, pickup verification passes, and status tracking.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start md:self-auto">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterStatus === status
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {filteredClaims.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-500 shadow-soft">
            <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-800">No Claims Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              There are no claims under status "{filterStatus}".
            </p>
          </div>
        ) : (
          filteredClaims.map((claim) => {
            const relatedItem = getItemById(claim.itemId);
            const isClaimant = currentUser && currentUser.id === claim.claimantId;
            const canReview = isAdmin || (relatedItem && relatedItem.reporterId === currentUser?.id);

            return (
              <div
                key={claim.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-soft p-5 sm:p-6 space-y-4 hover:shadow-soft-md transition"
              >
                {/* Top Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Badge variant={claim.status} size="sm">
                      {claim.status}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono">
                      Claim #{claim.id}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">
                      Filed {new Date(claim.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Claimant:</span>
                    <span className="font-bold text-slate-900">{claim.claimantName}</span>
                    <span className="text-slate-400">({claim.claimantEmail})</span>
                  </div>
                </div>

                {/* Item & Proof Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Item Information */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Target Belonging
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">{claim.itemTitle}</h4>
                    {relatedItem && (
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Found at: {relatedItem.location}</span>
                      </p>
                    )}
                  </div>

                  {/* Right: Claimant Proof */}
                  <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Claimant's Verification Evidence
                    </span>
                    <p className="text-xs text-slate-700 italic leading-relaxed">
                      "{claim.message}"
                    </p>
                  </div>
                </div>

                {/* Digital Pickup Pass (If Approved) */}
                {claim.status === 'APPROVED' && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                        PASS
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <h5 className="font-bold text-sm text-emerald-950">
                            Digital Campus Pickup Pass Issued
                          </h5>
                        </div>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          {claim.reviewMessage || 'Present this pass with your Student ID card at the Central Security Desk to collect your item.'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 bg-white/80 px-3 py-2 rounded-lg border border-emerald-200 text-xs font-mono">
                      <span className="text-emerald-700 font-bold">PASS CODE: </span>
                      <span className="text-slate-900 font-extrabold tracking-widest">
                        CF-{claim.id}-VERIFIED
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Footer */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  {relatedItem && (
                    <button
                      onClick={() => onViewItemDetails(relatedItem)}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Listing Details</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2 ml-auto">
                    {canReview && claim.status === 'PENDING' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onOpenReviewClaim(claim)}
                        icon={ShieldCheck}
                      >
                        Review & Decide
                      </Button>
                    )}

                    {isClaimant && claim.status === 'PENDING' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => cancelClaim(claim.id)}
                      >
                        Cancel Claim
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
