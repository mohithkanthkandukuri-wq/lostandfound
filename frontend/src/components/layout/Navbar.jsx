import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useItems } from '../../context/ItemsContext';
import {
  Compass,
  Search,
  PlusCircle,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  Menu,
  X,
  FileCheck2,
  Check,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const Navbar = ({ onOpenReportModal }) => {
  const { currentUser, logout, isAuthenticated, isAdmin } = useAuth();
  const { notifications, markNotificationAsRead, clearAllNotifications } = useItems();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const userNotifs = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id)
    : [];
  const unreadCount = userNotifs.filter((n) => !n.isRead).length;

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/items?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
      setIsMenuOpen(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? 'text-indigo-600 bg-indigo-50/80 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
    }`;

  return (
    <header className="sticky top-0 z-40 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight font-sans">
                  Campus<span className="text-indigo-600">Found</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                  Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Campus Recovery Network
              </p>
            </div>
          </Link>

          {/* Search bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative max-w-xs w-full"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search lost or found items..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm rounded-xl border border-transparent focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
            />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/items" className={navLinkClass}>
              Browse Items
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/claims" className={navLinkClass}>
              Claims
            </NavLink>
            <NavLink to="/help" className={navLinkClass}>
              Campus Desks
            </NavLink>
          </nav>

          {/* Right actions: Report CTA + Notifications + User */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Report CTA Button */}
            <button
              onClick={onOpenReportModal}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-soft hover:shadow-glow transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Item</span>
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-soft-lg border border-slate-100 p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                      <Badge variant="indigo" size="xs">
                        {userNotifs.length}
                      </Badge>
                    </div>
                    {userNotifs.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-slate-500 hover:text-indigo-600"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="mt-2 max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {userNotifs.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        No notifications yet. You're all caught up!
                      </div>
                    ) : (
                      userNotifs.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`p-2.5 rounded-xl transition cursor-pointer text-left ${
                            notif.isRead ? 'opacity-70 hover:bg-slate-50' : 'bg-indigo-50/50 hover:bg-indigo-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-slate-800">{notif.title}</p>
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-snug">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1.5 block">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Auth */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </p>
                    <span className="text-[10px] text-indigo-600 font-semibold uppercase">
                      {isAdmin ? 'Security Admin' : 'Student'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-soft-lg border border-slate-100 p-2 z-50 animate-fade-in">
                    <div className="p-2.5 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-1.5">
                        <Badge variant={isAdmin ? 'ADMIN' : 'USER'} size="xs">
                          {currentUser.department || 'Campus Member'}
                        </Badge>
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Student Dashboard
                    </Link>

                    <Link
                      to="/claims"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-xl"
                    >
                      <FileCheck2 className="w-4 h-4 text-slate-400" />
                      Claims Management
                    </Link>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle Navigation"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 animate-fade-in shadow-soft-lg">
          <form onSubmit={handleSearchSubmit} className="mb-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search items..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-100 text-sm rounded-xl border border-transparent focus:border-indigo-400 focus:outline-none"
            />
          </form>

          <div className="flex flex-col gap-1">
            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Home
            </NavLink>
            <NavLink
              to="/items"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Browse Items
            </NavLink>
            <NavLink
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/claims"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Claims
            </NavLink>
            <NavLink
              to="/help"
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Campus Recovery Desks
            </NavLink>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenReportModal();
              }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Report Lost or Found Item
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
