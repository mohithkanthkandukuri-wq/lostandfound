import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { MapPin, Calendar, Eye, ShieldCheck, Tag } from 'lucide-react';
import { getCategoryImage } from '../../utils/imageFallback';

export const ItemCard = ({ item, onViewDetails, onClaim }) => {
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
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={item.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <Badge variant={item.reportType} size="sm">
            {item.reportType === 'LOST' ? 'LOST ITEM' : 'FOUND ITEM'}
          </Badge>

          <Badge variant={item.status} size="sm">
            {item.status === 'RESOLVED' ? 'REUNITED' : 'ACTIVE'}
          </Badge>
        </div>

        {/* Bottom Tag */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
            <Tag className="w-3 h-3 text-indigo-300" />
            {item.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3
            onClick={() => onViewDetails(item)}
            className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer"
            title={item.title}
          >
            {item.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Metadata: Location & Date */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>Reported {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => onViewDetails(item)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200/60 transition"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>View Details</span>
          </button>

          {item.reportType === 'FOUND' && item.status === 'OPEN' && (
            <button
              onClick={() => onClaim ? onClaim(item) : onViewDetails(item)}
              className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Claim</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
