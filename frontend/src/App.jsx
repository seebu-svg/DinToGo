import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Loader } from 'lucide-react';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import DashboardLayout from './layouts/DashboardLayout';
import InfluencerDashboardLayout from './layouts/InfluencerDashboardLayout';

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
import MyDinnersPage from './pages/customer/MyDinnersPage';
import PeoplePage from './pages/customer/PeoplePage';
import MessagesPage from './pages/customer/MessagesPage';
import NotificationsPage from './pages/customer/NotificationsPage';
import SavedPage from './pages/customer/SavedPage';
import ReviewsPage from './pages/customer/ReviewsPage';
import InvitePage from './pages/customer/InvitePage';
import InfluencersPage from './pages/customer/InfluencersPage';
import RestaurantsPage from './pages/customer/RestaurantsPage';
import SettingsPage from './pages/customer/SettingsPage';

// Influencer Pages
import InfluencerHome from './pages/influencer/InfluencerHome';
import InfluencerDiscover from './pages/influencer/InfluencerDiscover';
import InfluencerDinners from './pages/influencer/InfluencerDinners';
import InfluencerCreateDinner from './pages/influencer/InfluencerCreateDinner';
import InfluencerPeople from './pages/influencer/InfluencerPeople';
import InfluencerRestaurants from './pages/influencer/InfluencerRestaurants';
import InfluencerMessages from './pages/influencer/InfluencerMessages';
import InfluencerInvitations from './pages/influencer/InfluencerInvitations';
import InfluencerReviews from './pages/influencer/InfluencerReviews';
import InfluencerAnalytics from './pages/influencer/InfluencerAnalytics';
import InfluencerProfile from './pages/influencer/InfluencerProfile';
import InfluencerNotifications from './pages/influencer/InfluencerNotifications';
import InfluencerSettings from './pages/influencer/InfluencerSettings';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import ManageDinners from './pages/dashboard/ManageDinners';
import ReservationsPage from './pages/dashboard/ReservationsPage';
import OffersPage from './pages/dashboard/OffersPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import { default as DashboardReviewsPage } from './pages/dashboard/ReviewsPage';
import CollaborationsPage from './pages/dashboard/CollaborationsPage';
import RestaurantProfilePage from './pages/dashboard/RestaurantProfilePage';
import CustomersPage from './pages/dashboard/CustomersPage';
import { default as DashboardNotificationsPage } from './pages/dashboard/NotificationsPage';
import { default as DashboardSettingsPage } from './pages/dashboard/SettingsPage';
import MarketingToolsPage from './pages/dashboard/MarketingToolsPage';
import HelpCenterPage from './pages/dashboard/HelpCenterPage';

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
        <Route path="/my-dinners" element={
          <ProtectedRoute><MyDinnersPage /></ProtectedRoute>
        } />
        <Route path="/dinners/create" element={
          <ProtectedRoute><CreateDinnerPage /></ProtectedRoute>
        } />
        <Route path="/dinners/:id" element={<DinnerDetailPage />} />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/influencers" element={<InfluencersPage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/invite" element={<InvitePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Influencer Dashboard */}
      <Route path="/influencer" element={
        <ProtectedRoute requireCreator>
          <InfluencerDashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<InfluencerHome />} />
        <Route path="discover" element={<InfluencerDiscover />} />
        <Route path="dinners" element={<InfluencerDinners />} />
        <Route path="create-dinner" element={<InfluencerCreateDinner />} />
        <Route path="people" element={<InfluencerPeople />} />
        <Route path="restaurants" element={<InfluencerRestaurants />} />
        <Route path="messages" element={<InfluencerMessages />} />
        <Route path="invitations" element={<InfluencerInvitations />} />
        <Route path="reviews" element={<InfluencerReviews />} />
        <Route path="analytics" element={<InfluencerAnalytics />} />
        <Route path="profile" element={<InfluencerProfile />} />
        <Route path="notifications" element={<InfluencerNotifications />} />
        <Route path="settings" element={<InfluencerSettings />} />
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
        <Route path="reviews" element={<DashboardReviewsPage />} />
        <Route path="collaborations" element={<CollaborationsPage />} />
        <Route path="notifications" element={<DashboardNotificationsPage />} />
        <Route path="settings" element={<DashboardSettingsPage />} />
        <Route path="marketing" element={<MarketingToolsPage />} />
        <Route path="help" element={<HelpCenterPage />} />
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
