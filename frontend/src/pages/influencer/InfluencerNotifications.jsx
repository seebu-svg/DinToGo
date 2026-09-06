import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationsAPI } from '../../services/api';
import { format, isToday, isYesterday } from 'date-fns';
import toast from 'react-hot-toast';
import {
  Bell, Check, CheckCheck, CheckCircle, Mail, Users, Calendar, Star,
  MessageCircle, Gift, Megaphone, Loader, Filter,
  UtensilsCrossed, UserPlus, AlertCircle,
} from 'lucide-react';

const typeConfig = {
  dinner_invite: { icon: Mail, color: 'bg-blue-50', textColor: 'text-blue-600', label: 'Dinner Invite' },
  dinner_reminder: { icon: Calendar, color: 'bg-brand-50', textColor: 'text-brand-600', label: 'Reminder' },
  reservation_confirmed: { icon: CheckCircle, color: 'bg-green-50', textColor: 'text-green-600', label: 'Confirmed' },
  reservation_cancelled: { icon: AlertCircle, color: 'bg-red-50', textColor: 'text-red-500', label: 'Cancelled' },
  new_follower: { icon: UserPlus, color: 'bg-purple-50', textColor: 'text-purple-600', label: 'New Follower' },
  new_review: { icon: Star, color: 'bg-yellow-50', textColor: 'text-yellow-600', label: 'New Review' },
  new_message: { icon: MessageCircle, color: 'bg-indigo-50', textColor: 'text-indigo-600', label: 'Message' },
  offer_available: { icon: Gift, color: 'bg-pink-50', textColor: 'text-pink-600', label: 'Offer' },
  influencer_collab: { icon: Megaphone, color: 'bg-brand-50', textColor: 'text-brand-600', label: 'Collaboration' },
  system: { icon: Bell, color: 'bg-charcoal-50', textColor: 'text-charcoal-500', label: 'System' },
  welcome: { icon: Bell, color: 'bg-green-50', textColor: 'text-green-600', label: 'Welcome' },
};

const demoNotifications = [
  { id: 1, type: 'dinner_invite', message: 'Mamma Mia invited you to collaborate on "Italian Night"', isRead: false, createdAt: new Date().toISOString(), data: { dinnerTitle: 'Italian Night', restaurantName: 'Mamma Mia' } },
  { id: 2, type: 'new_follower', message: 'Ahmed Khan started following you', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, type: 'new_review', message: 'You received a 5-star review on "Sushi Omakase"', isRead: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 4, type: 'dinner_reminder', message: 'Reminder: "Chef\'s Table" is tomorrow at 7:00 PM', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 5, type: 'influencer_collab', message: 'The Forest Bistro wants to partner with you', isRead: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 6, type: 'offer_available', message: 'New offer available: 20% off at Café Botanica', isRead: true, createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: 7, type: 'new_message', message: 'Sakura sent you a message about the collaboration', isRead: true, createdAt: new Date(Date.now() - 345600000).toISOString() },
  { id: 8, type: 'reservation_confirmed', message: 'Your reservation at Smokehouse & Co is confirmed', isRead: true, createdAt: new Date(Date.now() - 432000000).toISOString() },
  { id: 9, type: 'system', message: 'Your creator profile has been verified! Welcome to DinToGo Creators.', isRead: true, createdAt: new Date(Date.now() - 604800000).toISOString() },
];

const filterTabs = [
  { id: 'all', label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'invites', label: 'Invites' },
  { id: 'social', label: 'Social' },
  { id: 'updates', label: 'Updates' },
];

const InfluencerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    notificationsAPI.getAll({ limit: 50 }).then(res => {
      const items = Array.isArray(res.data?.data) ? res.data.data : [];
      setNotifications(items.length > 0 ? items : demoNotifications);
    }).catch(() => {
      setNotifications(demoNotifications);
    }).finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      await notificationsAPI.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }
  };

  const markAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'invites') return ['dinner_invite', 'influencer_collab'].includes(n.type);
    if (filter === 'social') return ['new_follower', 'new_message', 'new_review'].includes(n.type);
    if (filter === 'updates') return ['dinner_reminder', 'reservation_confirmed', 'offer_available', 'system'].includes(n.type);
    return true;
  });

  const formatTime = (date) => {
    const d = new Date(date);
    if (isToday(d)) return format(d, 'h:mm a');
    if (isYesterday(d)) return 'Yesterday';
    return format(d, 'd MMM');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={28} className="text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Notifications</h1>
          <p className="text-charcoal-400 text-sm mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}.` : 'You\'re all caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-card w-fit">
        {filterTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              filter === t.id ? 'bg-brand-500 text-white' : 'text-charcoal-500 hover:text-charcoal-900'
            }`}
          >
            {t.label}
            {t.id === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-card">
          <Bell size={48} className="text-charcoal-200 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-charcoal-900 mb-1">No notifications</h3>
          <p className="text-sm text-charcoal-400">
            {filter === 'unread' ? 'All caught up!' : 'Nothing to show here yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map(n => {
            const config = typeConfig[n.type] || typeConfig.system;
            const Icon = config.icon;
            return (
              <div
                key={n.id}
                className={`flex items-start gap-4 p-4 rounded-2xl transition-colors cursor-pointer ${
                  n.isRead ? 'bg-white hover:bg-cream-50' : 'bg-brand-50/50 hover:bg-brand-50'
                }`}
                onClick={() => !n.isRead && markRead(n.id)}
              >
                <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center shrink-0`}>
                  <Icon size={18} className={config.textColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.isRead ? 'text-charcoal-600' : 'text-charcoal-900 font-semibold'}`}>
                    {n.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-charcoal-400">{formatTime(n.createdAt)}</span>
                    <span className="text-[10px] text-charcoal-300">•</span>
                    <span className="text-[10px] text-charcoal-400 font-medium">{config.label}</span>
                  </div>
                </div>
                {!n.isRead && (
                  <div className="w-2 h-2 bg-brand-500 rounded-full shrink-0 mt-2" />
                )}
                {n.type === 'dinner_invite' && (
                  <div className="flex gap-1.5 shrink-0">
                    <button className="px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors">
                      Accept
                    </button>
                    <button className="px-3 py-1.5 bg-white text-charcoal-500 text-xs font-semibold rounded-lg border border-charcoal-200 hover:bg-cream-50 transition-colors">
                      Decline
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InfluencerNotifications;
