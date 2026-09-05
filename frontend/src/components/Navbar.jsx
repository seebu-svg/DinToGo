import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, Compass, UtensilsCrossed, User, Bell, MessageCircle,
  Menu, X, Search,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-charcoal-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <span className="text-xl font-display font-bold text-charcoal-900">DinToGo</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="btn-ghost flex items-center gap-2">
              <Home size={18} /> Home
            </Link>
            <Link to="/discover" className="btn-ghost flex items-center gap-2">
              <Compass size={18} /> Discover
            </Link>
            <Link to="/dinners" className="btn-ghost flex items-center gap-2">
              <UtensilsCrossed size={18} /> Dinners
            </Link>
            {isAuthenticated && (
              <Link to="/dinners/create" className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
                Create Dinner
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button className="btn-ghost p-2 relative">
                  <Bell size={20} />
                </button>
                <button className="btn-ghost p-2">
                  <MessageCircle size={20} />
                </button>
                <div className="relative group">
                  <button className="flex items-center gap-2 btn-ghost px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card-hover border border-charcoal-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-cream-50">
                      <User size={16} /> My Profile
                    </Link>
                    {user?.role === 'restaurant' && (
                      <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-cream-50">
                        <UtensilsCrossed size={16} /> Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-charcoal-100" />
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                      Log Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost">Log In</Link>
                <Link to="/register" className="btn-primary text-sm px-5 py-2">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden btn-ghost p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-charcoal-100 py-4 px-4 space-y-2">
          <Link to="/" onClick={() => setMobileOpen(false)} className="sidebar-link"><Home size={20} /> Home</Link>
          <Link to="/discover" onClick={() => setMobileOpen(false)} className="sidebar-link"><Compass size={20} /> Discover</Link>
          <Link to="/dinners" onClick={() => setMobileOpen(false)} className="sidebar-link"><UtensilsCrossed size={20} /> Dinners</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dinners/create" onClick={() => setMobileOpen(false)} className="sidebar-link text-brand-600">Create Dinner</Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="sidebar-link"><User size={20} /> Profile</Link>
              {user?.role === 'restaurant' && (
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="sidebar-link">Dashboard</Link>
              )}
              <button onClick={handleLogout} className="sidebar-link text-red-500 w-full">Log Out</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline flex-1 text-center text-sm">Log In</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-center text-sm">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
