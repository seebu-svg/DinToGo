import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, Compass, UtensilsCrossed, Users, Star, MapPin, MessageCircle,
  Bell, Bookmark, Sparkles, Settings, Utensils, Calendar,
} from 'lucide-react';

const mainNav = [
  { to: '/', label: 'Home', icon: Home, exact: true },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/dinners', label: 'Dinners', icon: UtensilsCrossed },
  { to: '/my-dinners', label: 'My Dinners', icon: Calendar },
  { to: '/people', label: 'People', icon: Users },
  { to: '/influencers', label: 'Influencers', icon: Star },
  { to: '/restaurants', label: 'Restaurants', icon: MapPin },
];

const secondaryNav = [
  { to: '/messages', label: 'Messages', icon: MessageCircle, badge: 5 },
  { to: '/notifications', label: 'Notifications', icon: Bell, badge: 3 },
  { to: '/saved', label: 'Saved', icon: Bookmark },
  { to: '/reviews', label: 'Reviews', icon: Star },
  { to: '/invite', label: 'Invite & Earn', icon: Sparkles },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const CustomerSidebar = () => {
  const { pathname } = useLocation();
  const { user, isAuthenticated } = useAuth();

  const isActive = (item) => {
    if (item.exact) return pathname === item.to;
    return pathname.startsWith(item.to);
  };

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-charcoal-100 bg-white sticky top-0 h-screen overflow-y-auto">
      {/* Logo + Tagline */}
      <div className="p-5 border-b border-charcoal-100">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-md shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300">
            <Utensils size={20} className="text-white" />
          </div>
          <div>
            <span className="text-xl font-display font-bold text-charcoal-900 leading-none tracking-tight">DinToGo</span>
            <p className="text-[10px] text-brand-500 font-medium leading-tight mt-0.5">Good Food Is Better Together</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="mb-3">
          <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider px-4 mb-2">Menu</p>
          {mainNav.map(({ to, label, icon: Icon, exact }) => {
            const active = isActive({ to, exact });
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-50'
                }`}
              >
                <Icon size={18} className={active ? 'text-brand-500' : ''} />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="border-t border-charcoal-100 my-3" />

        <div>
          <p className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider px-4 mb-2">Social</p>
          {secondaryNav.map(({ to, label, icon: Icon, badge, exact }) => {
            const active = isActive({ to, exact });
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-50'
                }`}
              >
                <Icon size={18} className={active ? 'text-brand-500' : ''} />
                {label}
                {badge && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile at Bottom */}
      {isAuthenticated && (
        <div className="p-4 border-t border-charcoal-100">
          <Link to="/profile" className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl hover:bg-cream-100 transition-colors">
            <div className="w-10 h-10 rounded-full bg-brand-100 overflow-hidden shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-600 text-sm font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-charcoal-900 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-charcoal-400 truncate">{user?.email || ''}</p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
};

export default CustomerSidebar;
