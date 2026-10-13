import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useItems } from '../context/ItemsContext';
import { CATEGORIES } from '../data/categories';
import { ItemCard } from '../components/items/ItemCard';
import {
  Compass,
  Search,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  ArrowRight,
  HelpCircle,
  Quote,
  TrendingUp,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';

export const HomePage = ({ onOpenReportModal, onViewItemDetails, onOpenClaim }) => {
  const { items } = useItems();
  const navigate = useNavigate();

  // Recently found items (only found items that are open or recently resolved)
  const recentFoundItems = items
    .filter((item) => item.reportType === 'FOUND')
    .slice(0, 4);

  // Statistics
  const totalReported = items.length + 1470;
  const returnedCount = items.filter((i) => i.status === 'RESOLVED').length + 1312;
  const activeCount = items.filter((i) => i.status === 'OPEN').length;
  const recoveryRate = '89%';

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 pb-12 sm:pb-20">
        {/* Subtle background glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none -z-10">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-violet-400/15 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Top pill badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-soft-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Official Campus Lost & Found Recovery Network</span>
          </div>

          {/* Hero Heading specified in prompt */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Lost Something? <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">
              Let's Bring It Home.
            </span>
          </h1>

          {/* Supporting description */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            A trusted, real-time recovery platform connecting college students, staff, and campus security. Report missing belongings, browse found items, verify ownership, and reunite safely.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <button
              onClick={() => onOpenReportModal('LOST')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow-soft-md hover:shadow-glow transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Report Lost Item</span>
            </button>

            <Link
              to="/items?type=FOUND"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-soft transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5 text-indigo-600" />
              <span>Browse Found Items</span>
            </Link>
          </div>

          {/* Live search pill quick bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div
              onClick={() => navigate('/items')}
              className="p-2 sm:p-2.5 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-soft-md transition flex items-center gap-3 cursor-pointer group"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition ml-2" />
              <span className="text-xs sm:text-sm text-slate-400 flex-1 text-left">
                Try searching: "MacBook Air", "Hydro Flask", "Keys", "ID card"...
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold group-hover:bg-indigo-600 group-hover:text-white transition">
                Search
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-soft-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-indigo-800/60">
            <div className="space-y-1 pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {totalReported.toLocaleString()}+
              </p>
              <p className="text-xs sm:text-sm text-indigo-200 font-medium">
                Items Reported
              </p>
            </div>

            <div className="space-y-1 pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">
                {returnedCount.toLocaleString()}+
              </p>
              <p className="text-xs sm:text-sm text-indigo-200 font-medium">
                Returned Belongings
              </p>
            </div>

            <div className="space-y-1 pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-300 tracking-tight">
                {recoveryRate}
              </p>
              <p className="text-xs sm:text-sm text-indigo-200 font-medium">
                Campus Recovery Rate
              </p>
            </div>

            <div className="space-y-1 pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                18 Hours
              </p>
              <p className="text-xs sm:text-sm text-indigo-200 font-medium">
                Avg. Reunion Turnaround
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES QUICK JUMP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Browse by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Find listings organized by belonging type
            </p>
          </div>
          <Link
            to="/items"
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/items?category=${encodeURIComponent(cat.id)}`)}
              className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-soft-md hover:border-indigo-300 transition-all text-center group flex flex-col items-center justify-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white transition flex items-center justify-center font-bold text-sm">
                {cat.name.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition truncate w-full">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. RECENTLY FOUND ITEMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Recently Reported
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Found on Campus
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Did you leave any of these behind? Check verification clues and claim.
            </p>
          </div>

          <Link
            to="/items?type=FOUND"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800"
          >
            <span>Browse All Found Items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentFoundItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onViewDetails={onViewItemDetails}
              onClaim={onOpenClaim}
            />
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS (3 STEPS) */}
      <section className="bg-slate-100/60 py-16 border-y border-slate-200/60" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Seamless Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How CampusFound Works
            </h2>
            <p className="text-sm text-slate-600">
              Three simple steps to protect student belongings and safely recover lost property.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-soft relative group hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-extrabold text-lg flex items-center justify-center mb-6">
                01
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                1. Report & Document
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether you lost an item or found someone's belongings, post a quick report with location, photos, and unique security hints.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-soft relative group hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-extrabold text-lg flex items-center justify-center mb-6">
                02
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                2. Search & Submit Claim
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Browse our real-time feed with location filters. Spot your item and submit proof of ownership details (e.g. serial #, lock wallpaper).
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-soft relative group hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-extrabold text-lg flex items-center justify-center mb-6">
                03
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                3. Verify & Reunited
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Campus Security or the finder reviews your claim. Once verified, pick up your belonging safely with your student ID pass.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS / SUCCESS STORIES (Identified as demo content) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
            <span>Demo Testimonials & Success Highlights</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Student Recovery Stories
          </h2>
          <p className="text-sm text-slate-500">
            Sample simulated outcomes showing how students recover critical items quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-amber-400 gap-1 text-xs">★★★★★</div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "I left my MacBook Air at the library 2nd floor desk before a midterm. Within 45 minutes of checking CampusFound, another student had posted it, and I got it back safely!"
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 font-bold text-indigo-700 text-xs flex items-center justify-center">
                SJ
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Sarah Jenkins</p>
                <p className="text-[11px] text-slate-500">Junior, Computer Science</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-amber-400 gap-1 text-xs">★★★★★</div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "Lost my car keys in the quad grass during homecoming week. Campus security verified my gym barcode token and had my keys ready at Gate 1 within an hour."
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 font-bold text-emerald-700 text-xs flex items-center justify-center">
                DK
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Devon Kim</p>
                <p className="text-[11px] text-slate-500">Sophomore, Business Admin</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-amber-400 gap-1 text-xs">★★★★★</div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "As campus staff, this portal eliminated the chaotic lost-and-found bin in our student center. Verification clues prevent theft and keep student records clean."
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-100 font-bold text-violet-700 text-xs flex items-center justify-center">
                ML
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Maria Lopez</p>
                <p className="text-[11px] text-slate-500">Student Center Operations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-soft-lg">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Found an item on campus right now?
            </h3>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              Help a fellow student by submitting a quick 60-second found listing or bringing it to your nearest Campus Security desk.
            </p>
          </div>

          <button
            onClick={() => onOpenReportModal('FOUND')}
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-700 font-bold text-sm shadow-soft transition active:scale-[0.98] flex-shrink-0"
          >
            Report Found Item
          </button>
        </div>
      </section>
    </div>
  );
};
