import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Star, MapPin, Verified, Users, Calendar, Search, Filter,
  Loader, Sparkles, TrendingUp, Award, ChefHat, X,
  Instagram, Youtube, Twitter,
} from 'lucide-react';

const demoInfluencers = [
  {
    id: 1, name: 'Foodieshehryar', role: 'Food Blogger', verified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=300&fit=crop',
    followers: '96K', dinnersHosted: 48, avgRating: 4.9,
    bio: 'Pakistan\'s top food blogger. Exploring the best cuisines from around the world.',
    specialties: ['Pakistani', 'Italian', 'Japanese'],
    upcomingDinners: 3,
    social: { instagram: '120K', youtube: '45K' },
  },
  {
    id: 2, name: 'Bites By Sana', role: 'Food Creator', verified: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=300&fit=crop',
    followers: '82K', dinnersHosted: 35, avgRating: 4.8,
    bio: 'Home chef turned food creator. Passionate about Mediterranean and fusion cuisine.',
    specialties: ['Mediterranean', 'Fusion', 'Vegan'],
    upcomingDinners: 2,
    social: { instagram: '95K' },
  },
  {
    id: 3, name: 'Hungry Traveller', role: 'Travel & Food', verified: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=300&fit=crop',
    followers: '128K', dinnersHosted: 62, avgRating: 4.7,
    bio: 'Travelling Pakistan one dish at a time. Street food enthusiast and BBQ master.',
    specialties: ['Street Food', 'BBQ', 'Chinese'],
    upcomingDinners: 5,
    social: { instagram: '150K', youtube: '80K' },
  },
  {
    id: 4, name: 'Spice Route', role: 'Chef & Creator', verified: true,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&h=300&fit=crop',
    followers: '64K', dinnersHosted: 28, avgRating: 4.9,
    bio: 'Professional chef sharing my love for Asian cuisine and fusion experiments.',
    specialties: ['Asian', 'Thai', 'Korean'],
    upcomingDinners: 1,
    social: { instagram: '70K' },
  },
  {
    id: 5, name: 'Desi Food Diaries', role: 'Food Blogger', verified: false,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=300&fit=crop',
    followers: '41K', dinnersHosted: 19, avgRating: 4.6,
    bio: 'Celebrating Pakistan\'s rich culinary heritage. From nihari to paye, I love it all.',
    specialties: ['Pakistani', 'Mughlai', 'Desi'],
    upcomingDinners: 2,
    social: { instagram: '45K' },
  },
  {
    id: 6, name: 'Sweet Tooth Studio', role: 'Pastry Chef', verified: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=300&fit=crop',
    followers: '55K', dinnersHosted: 22, avgRating: 4.8,
    bio: 'Pastry chef and dessert blogger. Hosting exclusive dessert tasting dinners.',
    specialties: ['Desserts', 'Baking', 'French'],
    upcomingDinners: 4,
    social: { instagram: '60K', youtube: '20K' },
  },
];

const sortOptions = [
  { id: 'popular', label: 'Most Popular' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'active', label: 'Most Active' },
  { id: 'newest', label: 'Newest' },
];

const InfluencersPage = () => {
  const [influencers, setInfluencers] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(new Set());

  useEffect(() => {
    setTimeout(() => {
      setInfluencers(demoInfluencers);
      setLoading(false);
    }, 500);
  }, []);

  const handleFollow = (id) => {
    setFollowing(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = influencers
    .filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.bio?.toLowerCase().includes(search.toLowerCase()) || i.specialties?.some(s => s.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sort === 'rating') return b.avgRating - a.avgRating;
      if (sort === 'active') return b.dinnersHosted - a.dinnersHosted;
      return parseFloat(b.followers) - parseFloat(a.followers);
    });

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-charcoal-900 mb-1.5">Influencers</h1>
        <p className="text-charcoal-400 text-sm">Follow top food creators, join their exclusive dinners, and discover curated experiences.</p>
      </div>

      {/* Featured Influencer */}
      {influencers.length > 0 && !search && (
        <div className="card overflow-hidden relative">
          <div className="absolute inset-0">
            <img src={influencers[0].coverImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/90 via-charcoal-900/60 to-transparent" />
          </div>
          <div className="relative p-6 md:p-8 flex items-center gap-6">
            <img src={influencers[0].avatar} alt={influencers[0].name} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-4 border-white/20 shadow-xl shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-brand-400" />
                <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">Featured Creator</span>
              </div>
              <h2 className="text-xl md:text-2xl font-display font-bold text-white flex items-center gap-2">
                {influencers[0].name}
                {influencers[0].verified && <Verified size={18} className="text-blue-400" />}
              </h2>
              <p className="text-charcoal-300 text-sm mt-1 line-clamp-2 max-w-lg">{influencers[0].bio}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-white text-sm"><strong>{influencers[0].followers}</strong> followers</span>
                <span className="text-charcoal-400">·</span>
                <span className="text-white text-sm"><strong>{influencers[0].dinnersHosted}</strong> dinners</span>
                <span className="text-charcoal-400">·</span>
                <span className="flex items-center gap-1 text-white text-sm"><Star size={13} className="text-amber-400 fill-amber-400" /> {influencers[0].avgRating}</span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => handleFollow(influencers[0].id)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    following.has(influencers[0].id)
                      ? 'bg-white/20 text-white hover:bg-white/30'
                      : 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30'
                  }`}
                >
                  {following.has(influencers[0].id) ? 'Following' : 'Follow'}
                </button>
                <Link to={`/profile/${influencers[0].id}`} className="px-5 py-2 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors">
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search creators by name, specialty, or cuisine..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-500">
              <X size={15} />
            </button>
          )}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="text-sm bg-white border border-charcoal-100 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300 text-charcoal-600"
        >
          {sortOptions.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((inf) => {
            const isFollowing = following.has(inf.id);
            return (
              <div key={inf.id} className="card overflow-hidden group">
                {/* Cover */}
                <div className="relative h-28 overflow-hidden">
                  <img src={inf.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/40 to-transparent" />
                  {inf.verified && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">
                      <Verified size={10} /> Verified
                    </span>
                  )}
                </div>

                {/* Avatar + Info */}
                <div className="px-4 pb-4 -mt-8 relative">
                  <Link to={`/profile/${inf.id}`}>
                    <img src={inf.avatar} alt={inf.name} className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md mb-3 group-hover:scale-105 transition-transform" />
                  </Link>
                  <Link to={`/profile/${inf.id}`}>
                    <h3 className="font-semibold text-charcoal-900 flex items-center gap-1.5">
                      {inf.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-brand-500 font-medium">{inf.role}</p>
                  <p className="text-xs text-charcoal-400 mt-1.5 line-clamp-2">{inf.bio}</p>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {inf.specialties?.slice(0, 3).map((s) => (
                      <span key={s} className="text-[10px] font-medium bg-cream-50 text-charcoal-500 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 mt-3 text-xs text-charcoal-500">
                    <span><strong className="text-charcoal-800">{inf.followers}</strong> followers</span>
                    <span className="flex items-center gap-0.5"><Star size={11} className="text-amber-400 fill-amber-400" /> {inf.avgRating}</span>
                    {inf.upcomingDinners > 0 && (
                      <span className="flex items-center gap-0.5 text-brand-500 font-medium">
                        <Calendar size={11} /> {inf.upcomingDinners} upcoming
                      </span>
                    )}
                  </div>

                  {/* Follow Button */}
                  <button
                    onClick={() => handleFollow(inf.id)}
                    className={`mt-3 w-full text-xs font-semibold py-2.5 rounded-xl transition-colors ${
                      isFollowing
                        ? 'bg-white border border-charcoal-200 text-charcoal-600 hover:border-red-200 hover:text-red-500'
                        : 'bg-brand-500 text-white hover:bg-brand-600'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Star size={40} className="text-charcoal-200 mx-auto mb-3" />
          <p className="text-charcoal-500 font-medium">No influencers found</p>
          <p className="text-charcoal-400 text-sm mt-1">Try a different search term.</p>
        </div>
      )}
    </div>
  );
};

export default InfluencersPage;
