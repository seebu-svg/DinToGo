import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dinnersAPI, restaurantsAPI, usersAPI } from '../../services/api';
import RestaurantCard from '../../components/RestaurantCard';
import InfluencerCard from '../../components/InfluencerCard';
import EmptyState from '../../components/EmptyState';
import { format, addDays } from 'date-fns';
import {
  Search, Compass, UtensilsCrossed, Users, Star, SlidersHorizontal,
  Heart, Calendar, MapPin, Loader, ChevronRight, Sparkles,
} from 'lucide-react';

const tabs = [
  { id: 'dinners', label: 'Dinners', icon: UtensilsCrossed },
  { id: 'restaurants', label: 'Restaurants', icon: MapPin },
  { id: 'people', label: 'People', icon: Users },
  { id: 'collaborations', label: 'Collaborations', icon: Sparkles },
];

const InfluencerDiscover = () => {
  const [tab, setTab] = useState('dinners');
  const [dinners, setDinners] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (tab === 'dinners') {
          const { data } = await dinnersAPI.getAll({ limit: 12 });
          setDinners(Array.isArray(data?.data) ? data.data : []);
        } else if (tab === 'restaurants') {
          const { data } = await restaurantsAPI.getAll({ limit: 12 });
          setRestaurants(Array.isArray(data?.data) ? data.data : []);
        } else if (tab === 'people') {
          const { data } = await usersAPI.getInfluencers({ limit: 12 });
          setPeople(Array.isArray(data?.data) ? data.data : []);
        }
      } catch { /* silent */ }
      setLoading(false);
    };
    load();
  }, [tab]);

  const collabOpportunities = [
    { id: 1, restaurant: 'Mamma Mia', title: 'Italian Night Host Needed', desc: 'Looking for a food influencer to host our Friday Italian Night. 30+ guests expected.', date: 'Sep 20', cuisine: 'Italian', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&h=120&fit=crop', seats: 30 },
    { id: 2, restaurant: 'The Forest Bistro', title: 'Weekend Brunch Collaboration', desc: 'Partner with us for a special weekend brunch experience. Menu tasting included.', date: 'Sep 22', cuisine: 'Continental', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&h=120&fit=crop', seats: 20 },
    { id: 3, restaurant: 'Sakura', title: 'Sushi & Sake Night Co-Host', desc: 'Co-host our exclusive sushi night. Perfect for food reviewers and bloggers.', date: 'Sep 25', cuisine: 'Japanese', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=120&h=120&fit=crop', seats: 16 },
    { id: 4, restaurant: 'Spice Bazaar', title: 'Street Food Festival Host', desc: 'Host our outdoor street food festival. Great exposure with 50+ attendees.', date: 'Oct 1', cuisine: 'Fusion', img: 'https://images.unsplash.com/photo-1529543544006-1b1b5015e899?w=120&h=120&fit=crop', seats: 50 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-charcoal-900">Discover</h1>
        <p className="text-charcoal-400 text-sm mt-1">Explore dinners, restaurants, people and collaboration opportunities.</p>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search dinners, restaurants, people..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-charcoal-100 rounded-xl text-sm font-medium text-charcoal-600 hover:bg-cream-50 transition-colors">
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-card">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 flex-1 justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-50'
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size={28} className="text-brand-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Dinners Tab */}
          {tab === 'dinners' && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {dinners.map(d => {
                const spotsLeft = (d.maxGuests || 0) - (d.currentGuests || 0);
                return (
                  <Link key={d.id} to={`/dinners/${d.id}`} className="card group relative overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={d.coverImage || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop'}
                        alt={d.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <Heart size={14} className="text-charcoal-500" />
                      </button>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-bold text-white text-sm truncate">{d.title}</h3>
                        <div className="flex items-center justify-between text-xs text-white/80 mt-1">
                          <span className="flex items-center gap-1"><Star size={12} className="text-brand-400 fill-brand-400" /> {d.ratingAverage || 'New'}</span>
                          <span className="font-semibold">{d.currency || '$'}{d.price || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-xs text-charcoal-400 mb-2">
                        <Calendar size={12} /> {format(new Date(d.date), 'EEE, d MMM')}
                        <span className="text-charcoal-200">•</span>
                        <MapPin size={12} /> {d.venue || d.city}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-charcoal-500">{spotsLeft > 0 ? `${spotsLeft} seats left` : 'Full'}</span>
                        <span className="badge-orange text-[10px]">{d.category || 'casual'}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {dinners.length === 0 && <EmptyState title="No dinners found" message="Try adjusting your search or filters." />}
            </div>
          )}

          {/* Restaurants Tab */}
          {tab === 'restaurants' && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {restaurants.map(r => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
              {restaurants.length === 0 && <EmptyState title="No restaurants found" message="Try adjusting your search." />}
            </div>
          )}

          {/* People Tab */}
          {tab === 'people' && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {people.map(p => (
                <InfluencerCard key={p.id} user={p} />
              ))}
              {people.length === 0 && <EmptyState title="No people found" message="Try adjusting your search." />}
            </div>
          )}

          {/* Collaborations Tab */}
          {tab === 'collaborations' && (
            <div className="grid sm:grid-cols-2 gap-5">
              {collabOpportunities.map(c => (
                <div key={c.id} className="card p-5 group hover:border-brand-200">
                  <div className="flex items-start gap-4">
                    <img src={c.img} alt={c.restaurant} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="badge-orange text-[10px] mb-1">{c.cuisine}</span>
                      <h3 className="font-bold text-charcoal-900 text-sm truncate">{c.title}</h3>
                      <p className="text-xs text-charcoal-400 mt-0.5">{c.restaurant} • {c.date}</p>
                      <p className="text-xs text-charcoal-500 mt-2 line-clamp-2">{c.desc}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-charcoal-400 flex items-center gap-1">
                          <Users size={12} /> {c.seats} guests expected
                        </span>
                        <button className="btn-primary text-xs px-4 py-2 rounded-xl">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InfluencerDiscover;
