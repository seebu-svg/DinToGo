import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dinnersAPI } from '../../services/api';
import { format } from 'date-fns';
import {
  UtensilsCrossed, Calendar, MapPin, Users, Loader, Plus,
  MoreHorizontal, Eye, Pencil, Trash2, Clock, CheckCircle,
  XCircle, Star, ChevronDown,
} from 'lucide-react';

const filterTabs = [
  { id: 'all', label: 'All Dinners' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'hosted', label: 'Hosted by Me' },
  { id: 'joined', label: 'Joined' },
  { id: 'past', label: 'Past' },
];

const statusBadge = {
  scheduled: { label: 'Scheduled', bg: 'bg-blue-50', text: 'text-blue-600', icon: Clock },
  active: { label: 'Active', bg: 'bg-green-50', text: 'text-green-600', icon: CheckCircle },
  full: { label: 'Full', bg: 'bg-brand-50', text: 'text-brand-600', icon: Users },
  completed: { label: 'Completed', bg: 'bg-charcoal-50', text: 'text-charcoal-600', icon: CheckCircle },
  cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-600', icon: XCircle },
  draft: { label: 'Draft', bg: 'bg-charcoal-50', text: 'text-charcoal-400', icon: Clock },
};

const InfluencerDinners = () => {
  const [filter, setFilter] = useState('all');
  const [hosted, setHosted] = useState([]);
  const [joined, setJoined] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [hostedRes, joinedRes] = await Promise.all([
          dinnersAPI.myHostedDinners().catch(() => ({ data: { data: [] } })),
          dinnersAPI.myAttending().catch(() => ({ data: { data: [] } })),
        ]);
        setHosted(Array.isArray(hostedRes.data?.data) ? hostedRes.data.data : []);
        setJoined(Array.isArray(joinedRes.data?.data) ? joinedRes.data.data : []);
      } catch { /* silent */ }
      setLoading(false);
    };
    load();
  }, []);

  const now = new Date();
  let dinners = [];
  if (filter === 'hosted') dinners = hosted;
  else if (filter === 'joined') dinners = joined;
  else if (filter === 'upcoming') dinners = [...hosted, ...joined].filter(d => new Date(d.date) >= now);
  else if (filter === 'past') dinners = [...hosted, ...joined].filter(d => new Date(d.date) < now);
  else dinners = [...hosted, ...joined];

  dinners.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={28} className="text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">My Dinners</h1>
          <p className="text-charcoal-400 text-sm mt-1">Manage your hosted and joined dinners.</p>
        </div>
        <Link to="/influencer/create-dinner" className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl">
          <Plus size={16} /> Create Dinner
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filterTabs.map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              filter === t.id
                ? 'bg-brand-500 text-white'
                : 'bg-white text-charcoal-500 hover:bg-cream-50 border border-charcoal-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Dinners List */}
      {dinners.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-card">
          <UtensilsCrossed size={48} className="text-charcoal-200 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-charcoal-900 mb-1">No dinners found</h3>
          <p className="text-sm text-charcoal-400 mb-4">
            {filter === 'hosted' ? 'You haven\'t hosted any dinners yet.' : filter === 'joined' ? 'You haven\'t joined any dinners yet.' : 'No dinners to show.'}
          </p>
          <Link to="/influencer/create-dinner" className="btn-primary text-sm">Create Your First Dinner</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {dinners.map(d => {
            const spotsLeft = (d.maxGuests || 0) - (d.currentGuests || 0);
            const pct = d.maxGuests ? Math.round((d.currentGuests / d.maxGuests) * 100) : 0;
            const st = statusBadge[d.status] || statusBadge.scheduled;
            const StIcon = st.icon;
            const isHost = hosted.some(h => h.id === d.id);

            return (
              <div key={d.id} className="bg-white rounded-2xl shadow-card p-5 hover:shadow-card-hover transition-shadow">
                <div className="flex items-start gap-4">
                  <img
                    src={d.coverImage || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&h=120&fit=crop'}
                    alt={d.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-charcoal-900 text-sm">{d.title}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${st.bg} ${st.text}`}>
                            <StIcon size={10} /> {st.label}
                          </span>
                          {isHost && <span className="badge-orange text-[10px]">Host</span>}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-charcoal-400">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {format(new Date(d.date), 'EEE, d MMM yyyy • h:mm a')}</span>
                          <span className="text-charcoal-200">•</span>
                          <span className="flex items-center gap-1"><MapPin size={12} /> {d.venue || d.city}</span>
                          <span className="text-charcoal-200">•</span>
                          <span className="flex items-center gap-1"><Star size={12} className="text-brand-400" /> {d.ratingAverage || 'New'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isHost && (
                          <Link to={`/dinners/${d.id}`} className="p-2 text-charcoal-400 hover:text-brand-500 hover:bg-cream-50 rounded-lg transition-colors">
                            <Pencil size={16} />
                          </Link>
                        )}
                        <Link to={`/dinners/${d.id}`} className="p-2 text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-50 rounded-lg transition-colors">
                          <Eye size={16} />
                        </Link>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-2 bg-charcoal-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-green-500' : pct >= 50 ? 'bg-brand-500' : 'bg-blue-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-charcoal-500 whitespace-nowrap">
                        {d.currentGuests}/{d.maxGuests} • {spotsLeft > 0 ? `${spotsLeft} left` : 'Full'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InfluencerDinners;
