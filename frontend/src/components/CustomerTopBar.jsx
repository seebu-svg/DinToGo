import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  ChevronDown,
  Search,
  Plus,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  User,
  UtensilsCrossed,
  X,
} from 'lucide-react';

const cities = [
  'Lahore, Pakistan',
  'Karachi, Pakistan',
  'Islamabad, Pakistan',
];

const CustomerTopBar = ({ searchValue = '', onSearchChange }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const searchRef = useRef(null);
  const cityRef = useRef(null);
  const profileRef = useRef(null);

  const [showCityMenu, setShowCityMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [city, setCity] = useState(cities[0]);

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
    navigate('/login');
  };

  // ⌘K / Ctrl+K focuses search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        setShowMobileSearch(true);
      }

      if (e.key === 'Escape') {
        setShowCityMenu(false);
        setShowProfileMenu(false);
        setShowMobileSearch(false);
      }
    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setShowCityMenu(false);
      }

      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 border-b border-charcoal-100 bg-white/95 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[1800px] items-center gap-2 px-3 sm:px-4 lg:gap-4 lg:px-6 xl:px-8">

        {/* Mobile Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 md:hidden"
          aria-label="DinToGo Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/20">
            <UtensilsCrossed size={18} strokeWidth={2.4} />
          </div>
        </Link>

        {/* Location Selector */}
        <div ref={cityRef} className="relative hidden shrink-0 md:block">
          <button
            type="button"
            onClick={() => {
              setShowCityMenu((prev) => !prev);
              setShowProfileMenu(false);
            }}
            aria-expanded={showCityMenu}
            className="flex max-w-[190px] items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-charcoal-500 transition-all hover:bg-cream-50 hover:text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <MapPin size={15} className="shrink-0 text-brand-500" />

            <span className="truncate">{city}</span>

            <ChevronDown
              size={13}
              className={`shrink-0 text-charcoal-300 transition-transform duration-200 ${
                showCityMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showCityMenu && (
            <div className="absolute left-0 top-[calc(100%+6px)] z-[60] w-56 overflow-hidden rounded-2xl border border-charcoal-100 bg-white py-1.5 shadow-xl shadow-black/10">
              {cities.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCity(c);
                    setShowCityMenu(false);
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                    c === city
                      ? 'bg-brand-50 font-semibold text-brand-600'
                      : 'text-charcoal-600 hover:bg-cream-50 hover:text-charcoal-900'
                  }`}
                >
                  <MapPin
                    size={14}
                    className={
                      c === city
                        ? 'text-brand-500'
                        : 'text-charcoal-400'
                    }
                  />
                  <span className="truncate">{c}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Search */}
        <div className="relative hidden min-w-0 max-w-2xl flex-1 md:block">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-300 transition-colors group-focus-within:text-brand-500"
          />

          <input
            ref={searchRef}
            type="search"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search dinners, restaurants, people..."
            aria-label="Search DinToGo"
            className="w-full rounded-full border border-charcoal-100 bg-cream-50 py-2.5 pl-10 pr-20 text-sm text-charcoal-900 outline-none transition-all placeholder:text-charcoal-400 hover:border-charcoal-200 focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
          />

          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange?.('')}
              aria-label="Clear search"
              className="absolute right-12 top-1/2 -translate-y-1/2 rounded-full p-1 text-charcoal-300 transition-colors hover:bg-charcoal-50 hover:text-charcoal-600"
            >
              <X size={14} />
            </button>
          )}

          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center rounded-md border border-charcoal-100 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-charcoal-400 shadow-sm lg:flex">
            ⌘K
          </kbd>
        </div>

        {/* Mobile Search Button */}
        <button
          type="button"
          onClick={() => {
            setShowMobileSearch(true);
            setTimeout(() => searchRef.current?.focus(), 50);
          }}
          aria-label="Open search"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-charcoal-500 transition-colors hover:bg-cream-50 hover:text-charcoal-900 md:hidden"
        >
          <Search size={19} />
        </button>

        {/* Mobile Search Overlay */}
        {showMobileSearch && (
          <div className="fixed inset-x-0 top-0 z-[100] border-b border-charcoal-100 bg-white p-3 shadow-lg md:hidden">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMobileSearch(false)}
                aria-label="Close search"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-charcoal-500 hover:bg-cream-50"
              >
                <X size={19} />
              </button>

              <div className="relative min-w-0 flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-300"
                />

                <input
                  ref={searchRef}
                  type="search"
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  placeholder="Search dinners, people, restaurants..."
                  aria-label="Search DinToGo"
                  className="w-full rounded-full border border-charcoal-100 bg-cream-50 py-2.5 pl-10 pr-10 text-sm outline-none focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                />

                {searchValue && (
                  <button
                    type="button"
                    onClick={() => onSearchChange?.('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1 md:hidden" />

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">

          {/* Create Dinner */}
          {isAuthenticated && (
            <Link
              to="/dinners/create"
              className="hidden items-center gap-1.5 rounded-full bg-brand-500 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20 transition-all hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/25 sm:flex lg:px-4"
            >
              <Plus size={16} />
              <span className="hidden lg:inline">Create Dinner</span>
              <span className="lg:hidden">Create</span>
            </Link>
          )}

          {/* Messages */}
          <Link
            to="/messages"
            aria-label="Messages"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-charcoal-400 transition-colors hover:bg-cream-50 hover:text-charcoal-800"
          >
            <MessageCircle size={19} />

            <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
              5
            </span>
          </Link>

          {/* Notifications */}
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-charcoal-400 transition-colors hover:bg-cream-50 hover:text-charcoal-800"
          >
            <Bell size={19} />

            <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
              3
            </span>
          </Link>

          <div className="mx-1 hidden h-5 w-px bg-charcoal-100 sm:block" />

          {/* Profile */}
          {isAuthenticated ? (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu((prev) => !prev);
                  setShowCityMenu(false);
                }}
                aria-label="Open profile menu"
                aria-expanded={showProfileMenu}
                className="flex items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-cream-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-sm font-bold text-brand-600 shadow-sm ring-2 ring-white">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name || 'Profile'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>

                <ChevronDown
                  size={13}
                  className={`hidden text-charcoal-400 transition-transform duration-200 md:block ${
                    showProfileMenu ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-[60] w-[250px] overflow-hidden rounded-2xl border border-charcoal-100 bg-white py-2 shadow-xl shadow-black/10">

                  {/* User Header */}
                  <div className="border-b border-charcoal-50 px-4 pb-3 pt-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-bold text-brand-600">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user?.name || 'Profile'}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          user?.name?.charAt(0)?.toUpperCase() || 'U'
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-charcoal-900">
                          {user?.name || 'User'}
                        </p>

                        <p className="truncate text-[11px] text-charcoal-400">
                          {user?.email || ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="pt-1">
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal-600 transition-colors hover:bg-cream-50 hover:text-charcoal-900"
                    >
                      <User size={16} />
                      My Profile
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal-600 transition-colors hover:bg-cream-50 hover:text-charcoal-900"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>

                    {user?.role === 'restaurant' && (
                      <Link
                        to="/dashboard"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal-600 transition-colors hover:bg-cream-50 hover:text-charcoal-900"
                      >
                        <UtensilsCrossed size={16} />
                        Restaurant Dashboard
                      </Link>
                    )}

                    <div className="my-1 border-t border-charcoal-100" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/login"
                className="hidden rounded-full px-3 py-2 text-sm font-semibold text-charcoal-600 transition-colors hover:bg-cream-50 hover:text-charcoal-900 sm:block"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-brand-500 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/20 transition-all hover:bg-brand-600 sm:px-4"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CustomerTopBar;