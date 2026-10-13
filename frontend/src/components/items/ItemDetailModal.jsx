import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useItems } from '../../context/ItemsContext';
import { useToast } from '../../context/ToastContext';
import { getCategoryImage } from '../../utils/imageFallback';
import {
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  Share2,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Lock,
  MessageSquare
} from 'lucide-react';

export const ItemDetailModal = ({ item, isOpen, onClose, onOpenClaim }) => {
  const { currentUser, isAdmin } = useAuth();
  const { markAsReturned, getClaimsForItem } = useItems();
  const { success, info } = useToast();
  const [imgError, setImgError] = useState(false);

  if (!item) return null;

  const itemClaims = getClaimsForItem(item.id);
  const isReporter = currentUser && currentUser.id === item.reporterId;
  const canMarkReturned = (isReporter || isAdmin) && item.status === 'OPEN';

  const formattedDate = new Date(item.incidentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin + `/items?id=${item.id}`);
    success('Item link copied to clipboard!', 'Link Copied');
  };

  const handleMarkReturned = () => {
    markAsReturned(item.id);
    onClose();
  };

  const displayImage = imgError
    ? getCategoryImage(item.category)
    : item.imagePath || getCategoryImage(item.category);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Image & Header */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 border border-slate-200">
          <img
            src={displayImage}
            alt={item.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant={item.reportType} size="md">
              {item.reportType === 'LOST' ? 'LOST BELONGING' : 'FOUND ON CAMPUS'}
            </Badge>
            <Badge variant={item.status} size="md">
              {item.status === 'RESOLVED' ? 'REUNITED & CLOSED' : 'ACTIVE LISTING'}
            </Badge>
          </div>
        </div>

        {/* Title & Metadata */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
              {item.category}
            </span>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-medium py-1 px-2 rounded-lg hover:bg-slate-100 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Listing</span>
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {item.title}
          </h2>

          <div className="mt-3 flex flex-wrap gap-4 text-xs sm:text-sm text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Full Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Detailed Description & Location Clues
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200/80 whitespace-pre-wrap">
            {item.description}
          </p>
        </div>

        {/* Verification Clue Hint (Anti-Fraud protection) */}
        {item.secretVerificationHint && (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-amber-900">Security Verification Prompt:</p>
              <p className="text-amber-800 mt-0.5 leading-relaxed">
                "{item.secretVerificationHint}" — Claimants must accurately verify this detail before handover.
              </p>
            </div>
          </div>
        )}

        {/* Reporter info card */}
        <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {item.reporterName ? item.reporterName.charAt(0) : 'U'}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Reported By</p>
              <p className="text-sm font-bold text-slate-900">{item.reporterName}</p>
              <p className="text-xs text-slate-500">{item.reporterEmail}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Claims Submitted</span>
            <span className="text-sm font-bold text-slate-800">
              {itemClaims.length} Claim{itemClaims.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* Actions bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <Button variant="secondary" onClick={onClose} size="sm">
            Close
          </Button>

          <div className="flex items-center gap-2">
            {canMarkReturned && (
              <Button
                variant="success"
                onClick={handleMarkReturned}
                icon={CheckCircle}
                size="sm"
              >
                Mark as Reunited / Returned
              </Button>
            )}

            {item.reportType === 'FOUND' && item.status === 'OPEN' && (
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  onOpenClaim(item);
                }}
                icon={ShieldCheck}
                size="sm"
              >
                Claim This Item
              </Button>
            )}

            {item.reportType === 'LOST' && item.status === 'OPEN' && !isReporter && (
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  onOpenClaim(item);
                }}
                icon={MessageSquare}
                size="sm"
              >
                I Found This / Send Tip
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
