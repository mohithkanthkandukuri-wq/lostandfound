import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useItems } from '../../context/ItemsContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, AlertCircle, FileCheck, CheckSquare, Lock } from 'lucide-react';

export const ClaimModal = ({ item, isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { submitClaim } = useItems();
  const { error } = useToast();

  const [message, setMessage] = useState('');
  const [studentId, setStudentId] = useState(currentUser?.studentId || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');
  const [agreedToHonorCode, setAgreedToHonorCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  if (!item) return null;

  const validate = () => {
    const errs = {};
    if (!message.trim() || message.trim().length < 15) {
      errs.message = 'Please provide detailed proof of ownership (at least 15 characters).';
    }
    if (!agreedToHonorCode) {
      errs.agreed = 'You must confirm ownership under the university code of conduct.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setValidationErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      submitClaim(item.id, message, {
        studentId,
        contactPhone,
        submittedAt: new Date().toISOString()
      });
      setMessage('');
      setAgreedToHonorCode(false);
      onClose();
    } catch (err) {
      error(err.message || 'Failed to submit ownership claim.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Ownership Claim"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Summary Banner */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
              Claiming Item
            </span>
            <p className="font-bold text-sm text-slate-900 truncate">{item.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.location}</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 font-semibold flex-shrink-0">
            {item.category}
          </span>
        </div>

        {/* Verification Clue from Finder */}
        {item.secretVerificationHint && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <span className="font-bold">Required Proof Prompt: </span>
              <span>"{item.secretVerificationHint}"</span>
            </div>
          </div>
        )}

        {/* Ownership Proof Message */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Proof of Ownership & Unique Details <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Describe details only the real owner would know: serial number, engravings, lockscreen background, scratches, or contents inside.
          </p>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. My initials 'MJ' are engraved on the back casing, and the wallpaper is my golden retriever..."
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition ${
              validationErrors.message
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
          />
          {validationErrors.message && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.message}
            </p>
          )}
        </div>

        {/* Student ID & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Student ID / Badge No.
            </label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="ST-2024-XXXX"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Callback Phone
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Honor code agreement */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToHonorCode}
              onChange={(e) => setAgreedToHonorCode(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs text-slate-600 leading-snug">
              I certify under the University Student Code of Conduct that I am the rightful owner of this item and will present valid university photo identification upon physical recovery.
            </span>
          </label>
          {validationErrors.agreed && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.agreed}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            icon={ShieldCheck}
          >
            Submit Ownership Claim
          </Button>
        </div>
      </form>
    </Modal>
  );
};
