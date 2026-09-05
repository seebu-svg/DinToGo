import { useState, useEffect } from 'react';
import { notificationsAPI } from '../../services/api';
import EmptyState from '../../components/EmptyState';
import { Bell, Check, CheckCheck, Loader, CalendarCheck, X, Star, Users, Tag, UtensilsCrossed } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const typeIcons = {
  reservation_confirmed: CalendarCheck,
  reservation_cancelled: X,
  new_review: Star,
  influencer_collab: Users,
  offer_available: Tag,
  dinner_invite: UtensilsCrossed,
  dinner_reminder: UtensilsCrossed,
  new_follower: Users,
  new_message: Bell,
  default: Bell,
};

const typeColors = {
  reservation_confirmed: 'bg-blue-50 text-blue-600',
  reservation_cancelled: 'bg-red-50 text-red-500',
  new_review: 'bg-yellow-50 text-yellow-600',
  influencer_collab: 'bg-purple-50 text-purple-600',
  offer_available: 'bg-green-50 text-green-600',
  dinner_invite: 'bg-brand-50 text-brand-600',
  dinner_reminder: 'bg-brand-50 text-brand-600',
  new_follower: 'bg-blue-50 text-blue-600',
  new_message: 'bg-cream-100 text-charcoal-600',
  default: 'bg-charcoal-100 text-charcoal-600',
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, unread

  useEffect(() => { fetchNotifications(); }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = filter === 'unread' ? { unreadOnly: 'true' } : {};
      const { data } = await notificationsAPI.getAll(params);
      setNotifications(data.data || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationsAPI.markRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const getIcon = (type) => {
    const Icon = typeIcons[type] || typeIcons.default;
    return Icon;
  };

  const getColor = (type) => typeColors[type] || typeColors.default;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal-900 flex items-center gap-3">
            <Bell className="text-brand-500" /> Notifications
            {unreadCount > 0 && (
              <span className="text-sm bg-brand-500 text-white rounded-full px-2.5 py-0.5 font-semibold">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-charcoal-400 mt-1">Stay updated on bookings, reviews, and collaborations.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="btn-ghost flex items-center gap-2 text-sm">
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {['all', 'unread'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-brand-500 text-white'
                : 'bg-white text-charcoal-600 border border-charcoal-100 hover:bg-cream-50'
            }`}
          >
            {f} {f === 'unread' && unreadCount > 0 && `(${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon = getIcon(n.type);
            return (
              <div
                key={n.id}
                className={`card p-5 flex items-start gap-4 transition-all ${
                  !n.isRead ? 'border-l-4 border-l-brand-500 bg-brand-50/30' : ''
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${getColor(n.type)}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!n.isRead ? 'font-semibold text-charcoal-900' : 'text-charcoal-700'}`}>
                        {n.title}
                      </p>
                      {n.message && (
                        <p className="text-sm text-charcoal-500 mt-1 line-clamp-2">{n.message}</p>
                      )}
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="text-xs text-brand-500 font-medium hover:underline shrink-0 flex items-center gap-1"
                      >
                        <Check size={14} /> Read
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    {n.sender && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-[10px] font-bold">
                          {n.sender.avatar ? (
                            <img src={n.sender.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            n.sender.name?.charAt(0)?.toUpperCase()
                          )}
                        </div>
                        <span className="text-xs text-charcoal-500">{n.sender.name}</span>
                      </div>
                    )}
                    <span className="text-xs text-charcoal-400">
                      {format(new Date(n.createdAt), 'd MMM, h:mm a')}
                    </span>
                    {n.isRead && (
                      <span className="text-xs text-charcoal-400">Read</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title={filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          description={filter === 'unread' ? 'You\'re all caught up!' : 'New bookings, reviews, and updates will appear here.'}
        />
      )}
    </div>
  );
};

export default NotificationsPage;
