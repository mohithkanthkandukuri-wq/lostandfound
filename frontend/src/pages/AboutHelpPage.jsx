import React from 'react';
import { CAMPUS_DESKS, CAMPUS_LOCATIONS } from '../data/locations';
import {
  Compass,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const AboutHelpPage = () => {
  const faqs = [
    {
      q: 'How long are found belongings kept at campus security?',
      a: 'Standard belongings are safely cataloged and stored for up to 90 days. High-value electronics (laptops, phones) and state/government IDs are secured in locked cabinets. Unclaimed items after 90 days are donated to university student charity programs.'
    },
    {
      q: 'What do I need to present when picking up an item?',
      a: 'To safeguard student property against fraud, you must show: (1) A valid university student ID or government-issued photo ID, and (2) Proof of ownership matching your claim (e.g. device unlocking, unique serial numbers, or matching passwords/stickers).'
    },
    {
      q: 'What should I do immediately after discovering my item is lost?',
      a: 'First, file a Lost Item Report on CampusFound so the entire university security staff and student body are alerted. Second, retrace your steps and check with the nearest recovery desk (such as the Library or Student Center desk).'
    },
    {
      q: 'Are rewards or finders fees allowed through the platform?',
      a: 'CampusFound promotes university integrity and community responsibility. Cash solicitations or hostage claims are strictly forbidden and violate the University Student Code of Conduct.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Campus Safety & Property Guidelines</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Campus Recovery Desks & Assistance
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
          Find your nearest campus security recovery desk, understand the safe handover policy, and learn how we protect lost items from unauthorized claims.
        </p>
      </div>

      {/* Recovery Desk Contact Cards */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-600" />
          <span>Physical Drop-off & Pickup Centers</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAMPUS_DESKS.map((desk, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft hover:shadow-soft-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm mb-4">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-base text-slate-900">{desk.name}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{desk.building}</span>
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{desk.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>{desk.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>{desk.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Authorized Custody Location
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety & Anti-Fraud Security Notice */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-soft-lg">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <ShieldCheck className="w-4 h-4 text-indigo-300" />
            <span>Anti-Fraud & Proof Verification Protocol</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How CampusFound Verifies Genuine Ownership
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
            To prevent dishonest claims, finders are encouraged to omit at least one distinguishing characteristic (such as a lock screen wallpaper, specific sticker, or device serial number) and set it as a security verification prompt.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-indigo-200">
            <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Matching serial numbers or Bluetooth pairing confirmation required for electronics.</span>
            </div>
            <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
              <Lock className="w-4 h-4 text-indigo-300 flex-shrink-0 mt-0.5" />
              <span>Physical handovers are logged with student ID records to maintain full auditability.</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft space-y-2"
            >
              <h3 className="font-bold text-base text-slate-900">{faq.q}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
