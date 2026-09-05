import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, UtensilsCrossed, CalendarCheck, Tag,
  BarChart3, Star, Users, LogOut, ChevronRight, ChevronDown,
  Bell, Megaphone, CreditCard, Settings, HelpCircle, UserRound,
  MessageSquare, Zap,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/dinners', label: 'Dinners', icon: UtensilsCrossed },
  { to: '/dashboard/reservations', label: 'Reservations', icon: CalendarCheck },
  { to: '/dashboard/offers', label: 'Offers & Discounts', icon: Tag },
  { to: '/dashboard/collaborations', label: 'Influencer Collaborations', icon: Users },
  { to: '/dashboard/customers', label: 'Customers', icon: UserRound },
  { to: '/dashboard/reviews', label: 'Reviews & Ratings', icon: Star },
  { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/dashboard/marketing', label: 'Marketing Tools', icon: MessageSquare },
  { to: '/dashboard/payouts', label: 'Payouts', icon: CreditCard },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  { to: '/dashboard/help', label: 'Help Center', icon: HelpCircle },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* ── Dark Sidebar ────────────────────────────────────────── */}
      <aside className="w-64 bg-charcoal-900 flex flex-col fixed h-full z-30">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-charcoal-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
              <UtensilsCrossed size={16} className="text-white" />
            </div>
            <div>
              <span className="text-base font-display font-bold text-white leading-none">DinToGo</span>
              <p className="text-[10px] text-charcoal-400 leading-tight">Partner App</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-500/20 text-brand-400'
                    : 'text-charcoal-400 hover:text-white hover:bg-charcoal-800'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-charcoal-800 space-y-3">
          {/* Restaurant Selector */}
          <button className="flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-brand-500/20 flex items-center justify-center">
              <UtensilsCrossed size={14} className="text-brand-400" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold text-white truncate">{user?.restaurantData?.businessName || 'My Restaurant'}</p>
            </div>
            <ChevronDown size={12} className="text-charcoal-400" />
          </button>

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-charcoal-800 to-charcoal-700 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-brand-400" />
              <p className="text-xs font-semibold text-white">Fill more tables tonight!</p>
            </div>
            <p className="text-[10px] text-charcoal-400 mb-2">Create a last-minute offer to attract nearby diners.</p>
            <button className="w-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors">
              Create Offer
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────── */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-charcoal-100 h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cream-50 hover:bg-cream-100 transition-colors">
              <div className="w-6 h-6 rounded-lg bg-brand-500/20 flex items-center justify-center">
                <UtensilsCrossed size={12} className="text-brand-500" />
              </div>
              <span className="text-sm font-medium text-charcoal-700">{user?.restaurantData?.businessName || 'My Restaurant'}</span>
              <ChevronDown size={12} className="text-charcoal-400" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-charcoal-400 hover:text-charcoal-700 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">8</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'R'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-charcoal-900 leading-none">{user?.name}</p>
                <p className="text-[10px] text-charcoal-400">Owner</p>
              </div>
              <ChevronDown size={12} className="text-charcoal-400" />
            </div>

            <button onClick={handleLogout} className="p-2 text-charcoal-400 hover:text-red-500 transition-colors" title="Log Out">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
