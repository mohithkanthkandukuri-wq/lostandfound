import React from 'react';

export const Badge = ({ variant = 'default', children, size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs font-medium',
    sm: 'px-2.5 py-0.5 text-xs font-semibold',
    md: 'px-3 py-1 text-sm font-semibold'
  };

  const variantClasses = {
    // Report Types
    LOST: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    FOUND: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    
    // Item Statuses
    OPEN: 'bg-blue-50 text-blue-700 border border-blue-200/80',
    RESOLVED: 'bg-purple-50 text-purple-700 border border-purple-200/80',
    CLOSED: 'bg-slate-100 text-slate-700 border border-slate-200',

    // Claim Statuses
    PENDING: 'bg-amber-50 text-amber-700 border border-amber-200/80',
    APPROVED: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    REJECTED: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    CANCELLED: 'bg-slate-100 text-slate-600 border border-slate-200',

    // Roles
    ADMIN: 'bg-indigo-900 text-indigo-100 border border-indigo-700',
    USER: 'bg-indigo-50 text-indigo-700 border border-indigo-200',

    // Neutral
    default: 'bg-slate-100 text-slate-700 border border-slate-200/60',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  };

  const chosenVariant = variantClasses[variant] || variantClasses.default;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${sizeClasses[size] || sizeClasses.sm} ${chosenVariant} ${className}`}
    >
      {variant === 'OPEN' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
      {variant === 'PENDING' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
      {variant === 'LOST' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
      {variant === 'FOUND' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
      {children || variant}
    </span>
  );
};
