import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Shield, Clock, Heart } from 'lucide-react';
import { CAMPUS_DESKS } from '../../data/locations';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Campus<span className="text-indigo-400">Found</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The official centralized recovery portal connecting students, faculty, and campus security to report, locate, and safely reclaim lost belongings.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-950/60 p-2.5 rounded-xl border border-indigo-900/60">
              <Shield className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>Campus Security Verified Recovery Platform</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/items" className="text-slate-400 hover:text-white transition">
                  Browse All Items
                </Link>
              </li>
              <li>
                <Link to="/items?type=LOST" className="text-slate-400 hover:text-white transition">
                  Lost Items Feed
                </Link>
              </li>
              <li>
                <Link to="/items?type=FOUND" className="text-slate-400 hover:text-white transition">
                  Found Belongings
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/claims" className="text-slate-400 hover:text-white transition">
                  Claims & Verifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus Desk Contacts */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Primary Desk Hotlines
            </h4>
            <div className="space-y-3.5 text-xs text-slate-400">
              {CAMPUS_DESKS.map((desk, idx) => (
                <div key={idx} className="border-l-2 border-indigo-500 pl-3">
                  <p className="font-semibold text-slate-200">{desk.name}</p>
                  <p className="flex items-center gap-1.5 mt-0.5 text-slate-400">
                    <MapPin className="w-3 h-3 text-slate-500" /> {desk.building}
                  </p>
                  <p className="flex items-center gap-1.5 mt-0.5 text-indigo-400">
                    <Phone className="w-3 h-3" /> {desk.phone}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Safe Pickup Policy */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Safe Recovery Guidelines
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Found high-value electronics are secured at Central Security Desk within 24 hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>Valid Campus Student ID or government photo identification is required for item handover.</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>For emergency after-hours assistance: security@campus.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CampusFound Platform. Built for University Student Safety & Community.</p>
          <div className="flex items-center gap-4">
            <Link to="/help" className="hover:text-slate-400 transition">
              Terms & Safe Handover Policy
            </Link>
            <span>•</span>
            <Link to="/help" className="hover:text-slate-400 transition">
              Privacy Notice
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
