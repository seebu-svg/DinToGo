import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Users, Search, UserPlus, UserCheck, Loader, MapPin,
  Star, Filter, SlidersHorizontal, X, Sparkles,
} from 'lucide-react';

const demoPeople = [
  { id: 1, name: 'Ahmed Khan', bio: 'Food enthusiast | Love trying new cuisines', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', location: { city: 'Lahore' }, followerCount: 342, followingCount: 128, influencerData: null, dinnersHosted: 5 },
  { id: 2, name: 'Sara Ali', bio: 'Home chef | Mediterranean food lover', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', location: { city: 'Karachi' }, followerCount: 567, followingCount: 201, influencerData: { role: 'Food Creator' }, dinnersHosted: 12 },
  { id: 3, name: 'Usman Tariq', bio: 'Street food explorer | BBQ fanatic', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', location: { city: 'Islamabad' }, followerCount: 189, followingCount: 95, influencerData: null, dinnersHosted: 3 },
  { id: 4, name: 'Fatima Noor', bio: 'Vegan foodie | Sustainable dining advocate', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', location: { city: 'Lahore' }, followerCount: 823, followingCount: 312, influencerData: { role: 'Food Blogger' }, dinnersHosted: 18 },
  { id: 5, name: 'Bilal Ahmed', bio: 'Fine dining connoisseur | Wine pairing expert', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', location: { city: 'Karachi' }, followerCount: 456, followingCount: 178, influencerData: null, dinnersHosted: 7 },
  { id: 6, name: 'Ayesha Malik', bio: 'Dessert lover | Baking enthusiast', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', location: { city: 'Islamabad' }, followerCount: 291, followingCount: 143, influencerData: null, dinnersHosted: 4 },
  { id: 7, name: 'Zain Ul Abideen', bio: 'Asian cuisine specialist | Ramen obsessed', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face', location: { city: 'Lahore' }, followerCount: 634, followingCount: 267, influencerData: { role: 'Food Creator' }, dinnersHosted: 9 },
  { id: 8, name: 'Hira Shah', bio: 'Brunch lover | Coffee addict', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', location: { city: 'Karachi' }, followerCount: 178, followingCount: 89, influencerData: null, dinnersHosted: 2 },
  { id: 9, name: 'Omar Farooq', bio: 'Grill master | Outdoor dining enthusiast', avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200&h=200&fit=crop&crop=face', location: { city: 'Islamabad' }, followerCount: 412, followingCount: 156, influencerData: null, dinnersHosted: 6 },
];

const PeoplePage = () => {
  const { user: currentUser } = useAuth();
  const [people, setPeople] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(new Set());

  useEffect(() => {
    usersAPI.getAll({ limit: 50 }).then(res => {
      const items = res.data?.data || [];
      setPeople(items.length > 0 ? items : demoPeople);
    }).catch(() => {
      setPeople(demoPeople);
    }).finally(() => setLoading(false));
  }, []);

  const handleFollow = (id) => {
    setFollowing(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = people.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || p.bio?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'creators' && p.influencerData) || (filter === 'active' && (p.dinnersHosted || 0) > 3);
    return matchSearch && matchFilter;
  });

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-charcoal-900 mb-1.5">People</h1>
        <p className="text-charcoal-400 text-sm">Discover food lovers, connect with fellow diners, and grow your community.</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people by name or bio..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-500">
              <X size={15} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {['all', 'creators', 'active'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-brand-500 text-white'
                  : 'bg-white border border-charcoal-100 text-charcoal-500 hover:border-charcoal-300'
              }`}
            >
              {f === 'all' ? 'Everyone' : f === 'creators' ? 'Creators' : 'Active Hosts'}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => {
            const isFollowing = following.has(p.id);
            const isOwnProfile = p.id === currentUser?.id;
            return (
              <div key={p.id} className="card group p-5 text-center">
                {/* Avatar */}
                <Link to={`/profile/${p.id}`} className="block mx-auto w-20 h-20 rounded-full bg-brand-100 mb-3 overflow-hidden group-hover:scale-105 transition-transform">
                  {p.avatar ? (
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-600 text-2xl font-bold">
                      {p.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </Link>

                {/* Name + Badge */}
                <Link to={`/profile/${p.id}`}>
                  <h3 className="font-semibold text-charcoal-900 text-base flex items-center justify-center gap-1.5">
                    {p.name}
                    {p.influencerData && <Sparkles size={13} className="text-brand-500" />}
                  </h3>
                </Link>

                {/* Bio */}
                {p.bio && <p className="text-xs text-charcoal-400 mt-1 line-clamp-2 px-2">{p.bio}</p>}

                {/* Location */}
                {p.location?.city && (
                  <div className="flex items-center justify-center gap-1 mt-2 text-xs text-charcoal-400">
                    <MapPin size={11} /> {p.location.city}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-charcoal-500">
                  <span><strong className="text-charcoal-800">{p.followerCount || 0}</strong> followers</span>
                  <span><strong className="text-charcoal-800">{p.dinnersHosted || 0}</strong> dinners</span>
                </div>

                {/* Creator Badge */}
                {p.influencerData && (
                  <span className="inline-block mt-2 text-[10px] font-semibold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                    {p.influencerData.role || 'Creator'}
                  </span>
                )}

                {/* Action */}
                {!isOwnProfile && (
                  <button
                    onClick={() => handleFollow(p.id)}
                    className={`mt-4 w-full text-xs font-semibold py-2 rounded-xl transition-colors ${
                      isFollowing
                        ? 'bg-white border border-charcoal-200 text-charcoal-600 hover:border-red-200 hover:text-red-500'
                        : 'bg-brand-500 text-white hover:bg-brand-600'
                    }`}
                  >
                    {isFollowing ? (
                      <span className="flex items-center justify-center gap-1.5"><UserCheck size={13} /> Following</span>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5"><UserPlus size={13} /> Follow</span>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Users size={40} className="text-charcoal-200 mx-auto mb-3" />
          <p className="text-charcoal-500 font-medium">No people found</p>
          <p className="text-charcoal-400 text-sm mt-1">Try a different search term or filter.</p>
        </div>
      )}
    </div>
  );
};

export default PeoplePage;
