import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantsAPI, collaborationsAPI } from '../../services/api';
import RestaurantCard from '../../components/RestaurantCard';
import EmptyState from '../../components/EmptyState';
import {
  Store, Search, SlidersHorizontal, Loader, MapPin, Star,
  Users, ChevronRight, Sparkles, Filter,
} from 'lucide-react';

const cuisineFilters = ['All', 'Italian', 'Japanese', 'Mexican', 'Indian', 'Continental', 'BBQ', 'Fusion', 'Café'];

const InfluencerRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('All');

  useEffect(() => {
    restaurantsAPI.getAll({ limit: 30 }).then(res => {
      setRestaurants(Array.isArray(res.data?.data) ? res.data.data : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = restaurants.filter(r => {
    const matchSearch = !search || r.name?.toLowerCase().includes(search.toLowerCase()) || r.cuisine?.some(c => c.toLowerCase().includes(search.toLowerCase()));
    const matchCuisine = cuisine === 'All' || r.cuisine?.some(c => c.toLowerCase() === cuisine.toLowerCase());
    return matchSearch && matchCuisine;
  });

  const suggestedPartners = [
    { id: 's1', name: 'Mamma Mia', cuisine: 'Italian', match: '95%', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&h=80&fit=crop', desc: 'Popular Italian restaurant looking for food bloggers.' },
    { id: 's2', name: 'Sakura', cuisine: 'Japanese', match: '88%', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=120&h=80&fit=crop', desc: 'Premium sushi bar seeking influencer partnerships.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal-900">Restaurants</h1>
        <p className="text-charcoal-400 text-sm mt-1">Discover restaurants and explore collaboration opportunities.</p>
      </div>

      {/* Suggested Partners */}
      <div>
        <h2 className="text-sm font-bold text-charcoal-900 mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-brand-500" /> Suggested Partners
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {suggestedPartners.map(r => (
            <div key={r.id} className="bg-white rounded-2xl shadow-card overflow-hidden group hover:shadow-card-hover transition-shadow">
              <div className="relative h-24 overflow-hidden">
                <img src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{r.match} match</span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-charcoal-900 text-sm">{r.name}</h3>
                  <span className="badge-orange text-[10px]">{r.cuisine}</span>
                </div>
                <p className="text-xs text-charcoal-400 mb-3">{r.desc}</p>
                <button className="w-full btn-primary text-xs py-2 rounded-xl">Request Collaboration</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search restaurants by name or cuisine..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 transition-all"
          />
        </div>
      </div>

      {/* Cuisine Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {cuisineFilters.map(c => (
          <button
            key={c}
            onClick={() => setCuisine(c)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              cuisine === c ? 'bg-brand-500 text-white' : 'bg-white text-charcoal-500 border border-charcoal-100 hover:bg-cream-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Restaurant Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader size={28} className="text-brand-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No restaurants found" message="Try adjusting your search or cuisine filter." />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(r => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InfluencerRestaurants;
