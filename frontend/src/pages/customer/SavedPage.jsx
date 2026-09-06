import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Bookmark, Heart, Calendar, MapPin, Users, Clock, Star,
  Loader, Trash2, ExternalLink, Share2, Filter,
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

const categories = [
  { id: 'all', label: 'All Saved' },
  { id: 'dinners', label: 'Dinners' },
  { id: 'restaurants', label: 'Restaurants' },
  { id: 'people', label: 'People' },
];

const demoSaved = [
  {
    id: 's1', type: 'dinner',
    title: 'Italian Night at La Terrazza',
    coverImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    restaurant: { name: 'La Terrazza', verified: true },
    date: new Date(Date.now() + 3 * 86400000).toISOString(),
    location: 'Gulberg, Lahore',
    attendees: { current: 5, max: 8 },
    price: 3500,
    savedAt: '2 hours ago',
  },
  {
    id: 's2', type: 'dinner',
    title: 'Sushi & Sake Night',
    coverImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop',
    restaurant: { name: 'Miyabi Sushi', verified: true },
    date: new Date(Date.now() + 7 * 86400000).toISOString(),
    location: 'DHA Phase 5, Lahore',
    attendees: { current: 3, max: 6 },
    price: 5500,
    savedAt: '1 day ago',
  },
  {
    id: 's3', type: 'restaurant',
    title: 'Mamma Mia Pizzeria',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    cuisine: 'Italian, Pizza',
    location: 'Gulberg III, Lahore',
    rating: 4.6,
    offer: '20% OFF for groups of 4+',
    savedAt: '3 days ago',
  },
  {
    id: 's4', type: 'dinner',
    title: 'Rooftop BBQ Evening',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
    restaurant: { name: 'The Grill House', verified: false },
    date: new Date(Date.now() + 14 * 86400000).toISOString(),
    location: 'Johar Town, Lahore',
    attendees: { current: 7, max: 12 },
    price: 2800,
    savedAt: '5 days ago',
  },
  {
    id: 's5', type: 'restaurant',
    title: 'Sushiya Japanese Restaurant',
    coverImage: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=600&h=400&fit=crop',
    cuisine: 'Japanese, Sushi',
    location: 'MM Alam Road, Lahore',
    rating: 4.8,
    offer: null,
    savedAt: '1 week ago',
  },
  {
    id: 's6', type: 'dinner',
    title: 'Wine & Cheese Social',
    coverImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop',
    restaurant: { name: 'The Vault Cafe', verified: true },
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    location: 'Cantt, Lahore',
    attendees: { current: 10, max: 10 },
    price: 4000,
    savedAt: '2 weeks ago',
  },
];

const SavedPage = () => {
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSaved(demoSaved);
      setLoading(false);
    }, 600);
  }, []);

  const handleRemove = (id) => {
    setSaved(prev => prev.filter(s => s.id !== id));
  };

  const filtered = category === 'all' ? saved : saved.filter(s => s.type === category.slice(0, -1) || s.type === category);

  const getDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    if (isPast(d)) return 'Past';
    return format(d, 'EEE, MMM d');
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-charcoal-900 mb-1.5">Saved</h1>
        <p className="text-charcoal-400 text-sm">Your collection of saved dinners, restaurants, and people.</p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              category === cat.id
                ? 'bg-brand-500 text-white'
                : 'bg-white border border-charcoal-100 text-charcoal-500 hover:border-charcoal-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
        <span className="text-xs text-charcoal-400 ml-2">{filtered.length} items</span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div key={item.id} className="card overflow-hidden group">
              {/* Cover Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Type Badge */}
                <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm ${
                  item.type === 'dinner' ? 'bg-brand-500/90 text-white' : 'bg-white/90 text-charcoal-700'
                }`}>
                  {item.type}
                </span>
                {/* Remove Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-charcoal-400 hover:text-red-500 hover:bg-white transition-colors"
                >
                  <Trash2 size={14} />
                </button>
                {/* Offer Badge */}
                {item.type === 'restaurant' && item.offer && (
                  <span className="absolute bottom-3 left-3 text-[10px] font-bold bg-green-500 text-white px-2.5 py-1 rounded-full">
                    {item.offer}
                  </span>
                )}
                {/* Past Badge */}
                {item.type === 'dinner' && isPast(new Date(item.date)) && (
                  <span className="absolute bottom-3 left-3 text-[10px] font-bold bg-charcoal-600/80 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                    Past Event
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-charcoal-900 text-sm mb-1.5 line-clamp-1">{item.title}</h3>

                {item.type === 'dinner' ? (
                  <>
                    <div className="flex items-center gap-1.5 text-xs text-charcoal-400 mb-1">
                      <MapPin size={12} /> {item.location}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-charcoal-500 mt-2">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {getDateLabel(item.date)}</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {item.attendees.current}/{item.attendees.max}</span>
                      <span className="font-semibold text-brand-600 ml-auto">Rs. {item.price.toLocaleString()}</span>
                    </div>
                    <Link to={`/dinners/${item.id}`} className="mt-3 w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors">
                      <ExternalLink size={13} /> View Dinner
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 text-xs text-charcoal-400 mb-1">
                      <MapPin size={12} /> {item.location}
                    </div>
                    {item.cuisine && <p className="text-xs text-charcoal-400">{item.cuisine}</p>}
                    {item.rating && (
                      <div className="flex items-center gap-1 mt-2 text-xs">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-charcoal-700">{item.rating}</span>
                      </div>
                    )}
                    <Link to="/restaurants" className="mt-3 w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors">
                      <ExternalLink size={13} /> View Restaurant
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Bookmark size={40} className="text-charcoal-200 mx-auto mb-3" />
          <p className="text-charcoal-500 font-medium">Nothing saved yet</p>
          <p className="text-charcoal-400 text-sm mt-1">Save dinners, restaurants, and people to find them here later.</p>
          <Link to="/discover" className="inline-block mt-4 text-sm font-semibold text-brand-500 hover:text-brand-700">
            Explore Dinners →
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavedPage;
