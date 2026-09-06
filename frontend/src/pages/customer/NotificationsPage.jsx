import { useState, useEffect } from 'react';
import { notificationsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Bell, Loader, Check, CheckCheck, Calendar, Users, Star,
  MessageCircle, Gift, UserPlus, UtensilsCrossed, Sparkles,
} from 'lucide-react';

const typeConfig = {
  dinner_invite: { icon: Calendar, color: 'bg-blue-50 text-blue-600', label: 'Dinner Invite' },
  dinner_reminder: { icon: Bell, color: 'bg-amber-50 text-amber-600', label: 'Reminder' },
  reservation_confirmed: { icon: Check, color: 'bg-green-50 text-green-600', label: 'Confirmed' },
  reservation_cancelled: { icon: Calendar, color: 'bg-red-50 text-red-500', label: 'Cancelled' },
  new_follower: { icon: UserPlus, color: 'bg-purple-50 text-purple-600', label: 'New Follower' },
  new_review: { icon: Star, color: 'bg-brand-50 text-brand-600', label: 'New Review' },
  new_message: { icon: MessageCircle, color: 'bg-blue-50 text-blue-600', label: 'Message' },
  offer_available: { icon: Gift, color: 'bg-green-50 text-green-600', label: 'Offer' },
  influencer_collab: { icon: Sparkles, color: 'bg-purple-50 text-purple-600', label: 'Collaboration' },
  system: { icon: Bell, color: 'bg-charcoal-50 text-charcoal-500', label: 'System' },
  welcome: { icon: Sparkles, color: 'bg-brand-50 text-brand-600', label: 'Welcome' },
};

const demoNotifications = [
  { id: 1, type: 'dinner_invite', title: 'Dinner Invitation', message: 'Ahmed Khan invited you to "Italian Night at La Terrazza"', time: '5 min ago', read: false, link: '/dinners/1' },
  { id: 2, type: 'new_follower', title: 'New Follower', message: 'Sara Ali started following you', time: '1 hour ago', read: false, link: '/profile/2' },
  { id: 3, type: 'reservation_confirmed', title: 'Reservation Confirmed', message: 'Your spot at "Sunset Dining Experience" is confirmed!', time: '2 hours ago', read: false, link: '/dinners/1' },
  { id: 4, type: 'new_message', title: 'New Message', message: 'Bilal Ahmed sent you a message about the BBQ dinner', time: '3 hours ago', read: true, link: '/messages' },
  { id: 5, type: 'offer_available', title: 'Exclusive Offer', message: '20% OFF at Mamma Mia for groups of 4+ — valid until May 31', time: '5 hours ago', read: true, link: '/discover' },
  { id: 6, type: 'dinner_reminder', title: 'Dinner Reminder', message: '"Sushi & Sake Night" is tomorrow at 8:00 PM', time: '8 hours ago', read: true, link: '/dinners/2' },
  { id: 7, type: 'new_review', title: 'New Review', message: 'Fatima Noor left a 5-star review on your dinner', time: '1 day ago', read: true, link: '/reviews' },
  { id: 8, type: 'influencer_collab', title: 'Collaboration Request', message: 'Foodieshehryar wants to co-host a dinner with you', time: '2 days ago', read: true, link: '/discover' },
  { id: 9, type: 'welcome', title: 'Welcome to DinToGo!', message: 'Start exploring dinners and connect with food lovers near you.', time: '3 days ago', read: true, link: '/discover' },
];

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsAPI.getAll({ limit: 50 }).then(res => {
      const items = res.data?.data || [];
      setNotifications(items.length > 0 ? items : demoNotifications);
    }).catch(() => {
      setNotifications(demoNotifications);
    }).finally(() => setLoading(false));
  }, []);

  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal-900 mb-1.5">Notifications</h1>
          <p className="text-charcoal-400 text-sm">Stay updated on dinner invites, messages, and community activity.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition-colors shrink-0"
          >
            <CheckCheck size={15} /> Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['all', 'unread'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-brand-500 text-white'
                : 'bg-white border border-charcoal-100 text-charcoal-500 hover:border-charcoal-300'
            }`}
          >
            {f === 'all' ? 'All' : 'Unread'}
            {f === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 bg-white/20 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((n) => {
            const config = typeConfig[n.type] || typeConfig.system;
            const Icon = config.icon;
            return (
              <div
                key={n.id}
                className={`card p-4 flex items-start gap-4 transition-colors ${
                  !n.read ? 'bg-brand-50/30 border-l-4 border-l-brand-400' : ''
                }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm ${!n.read ? 'font-bold text-charcoal-900' : 'font-medium text-charcoal-700'}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-charcoal-400 mt-0.5">{n.message}</p>
                    </div>
                    <span className="text-[10px] text-charcoal-400 shrink-0">{n.time}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {!n.read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="text-[10px] font-semibold text-brand-500 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Bell size={40} className="text-charcoal-200 mx-auto mb-3" />
          <p className="text-charcoal-500 font-medium">
            {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
          </p>
          <p className="text-charcoal-400 text-sm mt-1">
            {filter === 'unread' ? 'You\'ve read all your notifications.' : 'Dinner invites, messages, and updates will appear here.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
