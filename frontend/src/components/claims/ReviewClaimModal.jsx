import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useItems } from '../../context/ItemsContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileCheck2,
  QrCode,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail
} from 'lucide-react';

export const ReviewClaimModal = ({ claim, isOpen, onClose }) => {
  const { reviewClaim } = useItems();
  const { currentUser, isAdmin } = useAuth();
  const { success, warning } = useToast();

  const [reviewMessage, setReviewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!claim) return null;

  const handleAction = async (status) => {
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      reviewClaim(claim.id, status, reviewMessage);
      onClose();
    } catch (err) {
      // Handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Ownership Claim"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Item Header */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-500">Item Claimed</span>
            <Badge variant={claim.status} size="sm">
              {claim.status}
            </Badge>
          </div>
          <h4 className="font-bold text-slate-900 text-base">{claim.itemTitle}</h4>
        </div>

        {/* Claimant Info */}
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
            Claimant Profile
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-semibold">{claim.claimantName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              <span>{claim.claimantEmail}</span>
            </div>
            {claim.claimantPhone && (
              <div className="flex items-center gap-1.5 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-indigo-600" />
                <span>{claim.claimantPhone}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Submitted {new Date(claim.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Claimant's Proof Message */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Claimant's Verification Proof:
          </label>
          <div className="p-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 leading-relaxed italic">
            "{claim.message}"
          </div>
        </div>

        {/* Review feedback note */}
        {claim.status === 'PENDING' ? (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pickup Instructions or Decision Note
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Verified. Please visit Central Security Desk Room 101 with your Student ID."
              value={reviewMessage}
              onChange={(e) => setReviewMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        ) : (
          claim.reviewMessage && (
            <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-700">
              <span className="font-bold">Reviewer Note: </span>
              {claim.reviewMessage}
            </div>
          )
        )}

        {/* Action buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <Button variant="secondary" onClick={onClose} size="sm">
            Close
          </Button>

          {claim.status === 'PENDING' && (
            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                onClick={() => handleAction('REJECTED')}
                isLoading={isSubmitting}
                size="sm"
                icon={XCircle}
              >
                Decline Claim
              </Button>
              <Button
                variant="success"
                onClick={() => handleAction('APPROVED')}
                isLoading={isSubmitting}
                size="sm"
                icon={CheckCircle2}
              >
                Approve & Reunited
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
