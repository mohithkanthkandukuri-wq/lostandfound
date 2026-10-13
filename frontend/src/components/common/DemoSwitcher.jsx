import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useItems } from '../../context/ItemsContext';
import { checkBackendHealth } from '../../services/api';
import { UserCheck, ShieldCheck, RefreshCw, Server, Wifi, WifiOff } from 'lucide-react';

export const DemoSwitcher = () => {
  const { currentUser, switchDemoUser, usersList } = useAuth();
  const { resetDemoData } = useItems();
  const [backendOnline, setBackendOnline] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let mounted = true;
    const verify = async () => {
      setChecking(true);
      const isUp = await checkBackendHealth();
      if (mounted) {
        setBackendOnline(isUp);
        setChecking(false);
      }
    };
    verify();
    const interval = setInterval(verify, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-indigo-950 text-white text-xs py-1.5 px-4 border-b border-indigo-900/60">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Demo mode & backend indicator */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold tracking-wide border border-indigo-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
            PROTOTYPE DEMO MODE
          </span>

          <span
            className="flex items-center gap-1 text-slate-300"
            title={backendOnline ? 'Spring Boot REST backend reachable at :8080' : 'Operating in Standalone Prototype with LocalStorage sync'}
          >
            {backendOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-medium">Spring Boot API Connected</span>
              </>
            ) : (
              <>
                <Server className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-300">Standalone Prototype (LocalStorage Synced)</span>
              </>
            )}
          </span>
        </div>

        {/* Right: Quick persona switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 hidden md:inline">Demo Persona:</span>
            <select
              value={currentUser?.id || ''}
              onChange={(e) => switchDemoUser(e.target.value)}
              className="bg-indigo-900/80 text-white rounded-lg px-2.5 py-1 text-xs border border-indigo-700/60 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer font-medium"
            >
              {usersList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role === 'ADMIN' ? 'Security Desk Admin' : 'Student'})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={resetDemoData}
            title="Reset demo listings & claims back to original state"
            className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-300 hover:text-white hover:bg-indigo-800/60 transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
