import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useItems } from '../context/ItemsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { getCategoryImage } from '../utils/imageFallback';
import {
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  Share2,
  CheckCircle,
  HelpCircle,
  Lock,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';

export const ItemDetailPage = ({ onOpenClaim }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItemById, markAsReturned, getClaimsForItem } = useItems();
  const { currentUser, isAdmin } = useAuth();
  const { success } = useToast();
  const [imgError, setImgError] = useState(false);

  const item = getItemById(id);

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Item Not Found</h2>
        <p className="text-sm text-slate-600">
          The requested lost or found item listing could not be located or may have been deleted.
        </p>
        <Link
          to="/items"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Items
        </Link>
      </div>
    );
  }

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
    navigator.clipboard?.writeText(window.location.href);
    success('Link copied to clipboard!', 'Share Link');
  };

  const displayImage = imgError
    ? getCategoryImage(item.category)
    : item.imagePath || getCategoryImage(item.category);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/items" className="hover:text-indigo-600 transition flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-semibold truncate">{item.title}</span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden p-6 sm:p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200">
            <img
              src={displayImage}
              alt={item.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant={item.reportType} size="sm">
                {item.reportType === 'LOST' ? 'LOST BELONGING' : 'FOUND ON CAMPUS'}
              </Badge>
              <Badge variant={item.status} size="sm">
                {item.status === 'RESOLVED' ? 'REUNITED' : 'ACTIVE'}
              </Badge>
            </div>
          </div>

          {/* Core Info */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
                  {item.category}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-medium py-1 px-2 rounded-lg hover:bg-slate-100 transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {item.title}
              </h1>

              <div className="mt-4 space-y-2 text-xs sm:text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="font-medium text-slate-800">{item.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Reporter card */}
            <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {item.reporterName ? item.reporterName.charAt(0) : 'U'}
                </div>
                <div>
                  <p className="text-xs text-slate-400">Reported By</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{item.reporterName}</p>
                  <p className="text-[11px] text-slate-500">{item.reporterEmail}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Claims</span>
                <span className="text-sm font-bold text-slate-800">
                  {itemClaims.length}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {item.reportType === 'FOUND' && item.status === 'OPEN' && (
                <Button
                  variant="primary"
                  onClick={() => onOpenClaim(item)}
                  icon={ShieldCheck}
                  className="flex-1"
                >
                  Claim This Belonging
                </Button>
              )}

              {canMarkReturned && (
                <Button
                  variant="success"
                  onClick={() => markAsReturned(item.id)}
                  icon={CheckCircle}
                  className="flex-1"
                >
                  Mark Returned
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Detailed description */}
        <div className="pt-6 border-t border-slate-100 space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Full Description
          </h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50/60 p-5 rounded-2xl border border-slate-100 whitespace-pre-wrap">
            {item.description}
          </p>
        </div>

        {/* Verification hint */}
        {item.secretVerificationHint && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <p className="font-bold text-amber-900">Finder Verification Challenge:</p>
              <p className="text-amber-800 mt-1">"{item.secretVerificationHint}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
