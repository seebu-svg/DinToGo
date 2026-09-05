import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Loader } from 'lucide-react';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Customer Pages
import HomePage from './pages/customer/HomePage';
import DiscoverPage from './pages/customer/DiscoverPage';
import DinnersPage from './pages/customer/DinnersPage';
import DinnerDetailPage from './pages/customer/DinnerDetailPage';
import CreateDinnerPage from './pages/customer/CreateDinnerPage';
import ProfilePage from './pages/customer/ProfilePage';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import ManageDinners from './pages/dashboard/ManageDinners';
import ReservationsPage from './pages/dashboard/ReservationsPage';
import OffersPage from './pages/dashboard/OffersPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import ReviewsPage from './pages/dashboard/ReviewsPage';
import CollaborationsPage from './pages/dashboard/CollaborationsPage';
import RestaurantProfilePage from './pages/dashboard/RestaurantProfilePage';
import CustomersPage from './pages/dashboard/CustomersPage';
import NotificationsPage from './pages/dashboard/NotificationsPage';
import SettingsPage from './pages/dashboard/SettingsPage';

// Protected route with role and creator support
const ProtectedRoute = ({ children, roles, requireCreator }) => {
  const { user, loading, isCreator } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  
  // Check if creator status is required
  if (requireCreator && !isCreator) {
    return <Navigate to="/" replace />;
  }
  
  // Check role-based access
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream-50">
    <div className="text-center">
      <Loader className="w-8 h-8 text-brand-500 animate-spin mx-auto mb-3" />
      <p className="text-charcoal-400 text-sm">Loading DinToGo...</p>
    </div>
  </div>
);

// Simple placeholder for upcoming pages
const ComingSoon = ({ title }) => (
  <div className="flex items-center justify-center py-20">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-charcoal-900 mb-2">{title}</h2>
      <p className="text-charcoal-400 text-sm">This page is coming soon.</p>
    </div>
  </div>
);

const App = () => {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Customer App */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/dinners" element={<DinnersPage />} />
        <Route path="/dinners/create" element={
          <ProtectedRoute><CreateDinnerPage /></ProtectedRoute>
        } />
        <Route path="/dinners/:id" element={<DinnerDetailPage />} />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/people" element={<ComingSoon title="People" />} />
        <Route path="/influencers" element={<DiscoverPage />} />
        <Route path="/restaurants" element={<DiscoverPage />} />
        <Route path="/messages" element={<ComingSoon title="Messages" />} />
        <Route path="/notifications" element={<ComingSoon title="Notifications" />} />
        <Route path="/saved" element={<ComingSoon title="Saved" />} />
        <Route path="/reviews" element={<ComingSoon title="Reviews" />} />
        <Route path="/invite" element={<ComingSoon title="Invite & Earn" />} />
      </Route>

      {/* Restaurant Dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute roles={['restaurant', 'admin']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardHome />} />
        <Route path="profile" element={<RestaurantProfilePage />} />
        <Route path="dinners" element={<ManageDinners />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="offers" element={<OffersPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="collaborations" element={<CollaborationsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="marketing" element={<ComingSoon title="Marketing Tools" />} />
        <Route path="help" element={<ComingSoon title="Help Center" />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-cream-50">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-charcoal-900 mb-2">404</h1>
            <p className="text-charcoal-400 mb-6">This page doesn't exist.</p>
            <a href="/" className="btn-primary">Go Home</a>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default App;
