import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { MapPin, Calendar, Eye, ShieldCheck, Tag } from 'lucide-react';
import { getCategoryImage } from '../../utils/imageFallback';

export const ItemListItem = ({ item, onViewDetails, onClaim }) => {
  const [imageError, setImageError] = useState(false);

  const displayImage = imageError
    ? getCategoryImage(item.category)
    : item.imagePath || getCategoryImage(item.category);

  const formattedDate = new Date(item.incidentDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-soft-md transition-all duration-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
      {/* Thumbnail */}
      <div className="relative w-full sm:w-44 h-32 sm:h-28 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
        <img
          src={displayImage}
          alt={item.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          <Badge variant={item.reportType} size="xs">
            {item.reportType}
          </Badge>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <Badge variant={item.status} size="xs">
            {item.status === 'RESOLVED' ? 'REUNITED' : 'ACTIVE'}
          </Badge>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-400" />
            {item.category}
          </span>
        </div>

        <h3
          onClick={() => onViewDetails(item)}
          className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors cursor-pointer truncate"
        >
          {item.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
            {item.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <button
          onClick={() => onViewDetails(item)}
          className="flex-1 sm:w-32 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200/60 transition"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>

        {item.reportType === 'FOUND' && item.status === 'OPEN' && (
          <button
            onClick={() => onClaim ? onClaim(item) : onViewDetails(item)}
            className="flex-1 sm:w-32 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Claim</span>
          </button>
        )}
      </div>
    </div>
  );
};
