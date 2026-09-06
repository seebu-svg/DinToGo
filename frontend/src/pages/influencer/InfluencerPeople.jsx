import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Users, UserPlus, UserMinus, Search, Loader, ChevronRight,
  UserCheck, MapPin, Star,
} from 'lucide-react';

const tabs = [
  { id: 'followers', label: 'Followers' },
  { id: 'following', label: 'Following' },
];

const InfluencerPeople = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('followers');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        const [fRes, fgRes] = await Promise.all([
          usersAPI.getFollowers(user.id).catch(() => ({ data: { data: [] } })),
          usersAPI.getFollowing(user.id).catch(() => ({ data: { data: [] } })),
        ]);
        setFollowers(Array.isArray(fRes.data?.data) ? fRes.data.data : []);
        setFollowing(Array.isArray(fgRes.data?.data) ? fgRes.data.data : []);
      } catch { /* silent */ }
      setLoading(false);
    };
    load();
  }, [user?.id]);

  const list = tab === 'followers' ? followers : following;
  const filtered = search
    ? list.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()))
    : list;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal-900">People</h1>
        <p className="text-charcoal-400 text-sm mt-1">Manage your followers and connections.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-card p-5 text-center">
          <p className="text-2xl font-bold text-charcoal-900">{user?.followerCount || 0}</p>
          <p className="text-xs text-charcoal-400 mt-0.5">Followers</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-5 text-center">
          <p className="text-2xl font-bold text-charcoal-900">{user?.followingCount || 0}</p>
          <p className="text-xs text-charcoal-400 mt-0.5">Following</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-5 text-center">
          <p className="text-2xl font-bold text-brand-500">
            {user?.followerCount && user?.followingCount
              ? (user.followerCount / user.followingCount).toFixed(1)
              : '—'}
          </p>
          <p className="text-xs text-charcoal-400 mt-0.5">Ratio</p>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-card">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-brand-500 text-white' : 'text-charcoal-500 hover:text-charcoal-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1 relative min-w-[200px]">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all"
          />
        </div>
      </div>

      {/* People List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader size={28} className="text-brand-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-card">
          <Users size={48} className="text-charcoal-200 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-charcoal-900 mb-1">
            No {tab} yet
          </h3>
          <p className="text-sm text-charcoal-400">
            {tab === 'followers' ? 'Share dinners to attract followers.' : 'Follow other users to build your network.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(u => (
            <div key={u.id} className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4 hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm shrink-0 overflow-hidden">
                {u.avatar ? (
                  <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                ) : (
                  u.name?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link to={`/profile/${u.id}`} className="font-semibold text-charcoal-900 text-sm hover:text-brand-500 transition-colors">
                    {u.name}
                  </Link>
                  {u.influencerData && <UserCheck size={14} className="text-blue-500" />}
                </div>
                <p className="text-xs text-charcoal-400 truncate">
                  {u.bio || u.email}
                  {u.location?.city && ` • ${u.location.city}`}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {tab === 'following' ? (
                  <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-full hover:bg-red-50 transition-colors">
                    <UserMinus size={12} /> Unfollow
                  </button>
                ) : (
                  <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-brand-500 border border-brand-200 rounded-full hover:bg-brand-50 transition-colors">
                    <UserPlus size={12} /> Follow Back
                  </button>
                )}
                <Link to={`/profile/${u.id}`} className="p-2 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-50 rounded-lg transition-colors">
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InfluencerPeople;
