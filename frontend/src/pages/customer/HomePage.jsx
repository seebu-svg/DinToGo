import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dinnersAPI, resolveImageUrl } from '../../services/api';
import { format, isToday, isTomorrow } from 'date-fns';
import {
  Heart, ChevronRight, Moon, Calendar, Flame, UserPlus,
  Award, Gift, Star,
} from 'lucide-react';

const quickFilters = [
  { label: 'Tonight', icon: Moon },
  { label: 'This Weekend', icon: Calendar },
  { label: 'Foodies', icon: Flame },
  { label: 'New People', icon: UserPlus },
  { label: 'Top Influencers', icon: Award },
];

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { search } = useOutletContext();
  const [dinners, setDinners] = useState([]);

  useEffect(() => {
    dinnersAPI.getAll({ limit: 8 }).then(res => {
      const items = res.data?.data;
      setDinners(Array.isArray(items) ? items : []);
    }).catch(() => {});
  }, []);

  const getDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    if (isToday(d)) return 'Tonight';
    if (isTomorrow(d)) return 'Tomorrow';
    return format(d, 'EEE, d MMM');
  };

  const getTimeStr = (dateStr) => format(new Date(dateStr), 'h:mm a');

  const upcomingDinners = dinners.filter(d => new Date(d.date) >= new Date()).slice(0, 4);
  const trendingDinners = [...dinners].sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0)).slice(0, 4);

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 space-y-8">
      {/* Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-charcoal-900">
        <img
          src="https://images.unsplash.com/photo-1529543544006-1b1b5015e899?w=1200&h=400&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight mb-2">
              Good Food Is Better<br />Together.
            </h1>
            <p className="text-charcoal-300 text-sm mb-4">Find people. Share tables. Create memories.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {quickFilters.map(({ label, icon: Icon }) => (
                <button key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-xs font-medium rounded-full transition-colors">
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
          </div>
          {/* Featured Dinner Card */}
          {upcomingDinners[0] && (
            <div className="w-full md:w-72 bg-white rounded-2xl p-4 shrink-0">
              <div className="flex items-center gap-2 text-xs text-charcoal-400 mb-2">
                <Calendar size={12} /> {getDateLabel(upcomingDinners[0].date)} • {getTimeStr(upcomingDinners[0].date)}
              </div>
              <h3 className="font-bold text-charcoal-900 text-sm mb-1">{upcomingDinners[0].title}</h3>
              <p className="text-xs text-charcoal-400 mb-3">{upcomingDinners[0].venue || upcomingDinners[0].city}</p>
              <Link to={`/dinners/${upcomingDinners[0].id}`} className="block w-full bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold py-2 rounded-xl text-center transition-colors">
                Join Dinner
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Near You */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-charcoal-900">Upcoming Near You</h2>
          <Link to="/dinners" className="text-brand-500 text-sm font-medium hover:underline flex items-center gap-1">View All <ChevronRight size={14} /></Link>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {upcomingDinners.map((d) => {
            const spotsLeft = (d.maxGuests || 0) - (d.currentGuests || 0);
            return (
              <Link key={d.id} to={`/dinners/${d.id}`} className="card p-4 group">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500 shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-charcoal-400 font-medium uppercase tracking-wide">{getDateLabel(d.date)}</span>
                    <h3 className="font-semibold text-charcoal-900 text-sm leading-tight truncate">{d.title}</h3>
                    <p className="text-xs text-charcoal-400 mt-0.5">{getTimeStr(d.date)} • {d.venue || d.city}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-charcoal-500">{spotsLeft > 0 ? `${spotsLeft} Seats Left` : 'Full'} • ${d.price || 0}</span>
                  <div className="flex -space-x-2">
                    {(d.guestAvatars?.length > 0 ? d.guestAvatars : d.host?.avatar ? [{ avatar: d.host.avatar }] : []).slice(0, 3).map((g, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-brand-100 border-2 border-white overflow-hidden flex items-center justify-center">
                        {g.avatar ? (
                          <img src={resolveImageUrl(g.avatar)} alt={g.name || ''} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-brand-600 text-[8px] font-bold">{g.name?.charAt(0)?.toUpperCase() || '?'}</span>
                        )}
                      </div>
                    ))}
                    {(d.currentGuests || 0) > 3 && (
                      <div className="w-6 h-6 rounded-full bg-charcoal-100 border-2 border-white flex items-center justify-center text-charcoal-500 text-[8px] font-bold">+{d.currentGuests - 3}</div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trending Dinners */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-charcoal-900">Trending Dinners</h2>
          <Link to="/dinners" className="text-brand-500 text-sm font-medium hover:underline flex items-center gap-1">View All <ChevronRight size={14} /></Link>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {trendingDinners.map((d, idx) => (
            <Link key={d.id} to={`/dinners/${d.id}`} className="card group relative overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={d.coverImage || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop'}
                  alt={d.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-3 left-3 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-xs font-bold text-charcoal-800">{idx + 1}</span>
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <Heart size={14} className="text-charcoal-500" />
                </button>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-white text-sm leading-tight truncate">{d.title}</h3>
                  <div className="flex items-center justify-between text-xs text-white/80 mt-1">
                    <span className="flex items-center gap-1"><Star size={12} className="text-brand-400 fill-brand-400" /> {d.ratingAverage || '0'}</span>
                    <span className="font-semibold">${d.price || 0}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between text-xs">
                <div className="text-charcoal-400">
                  <span>{format(new Date(d.date), 'EEE, d MMM')} • {format(new Date(d.date), 'h:mm a')}</span>
                  <p className="truncate">{d.venue || d.city}</p>
                </div>
                <div className="flex -space-x-2 shrink-0">
                  {(d.guestAvatars?.length > 0 ? d.guestAvatars : d.host?.avatar ? [{ avatar: d.host.avatar }] : []).slice(0, 3).map((g, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-brand-100 border-2 border-white overflow-hidden flex items-center justify-center">
                      {g.avatar ? (
                        <img src={resolveImageUrl(g.avatar)} alt={g.name || ''} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-brand-600 text-[8px] font-bold">{g.name?.charAt(0)?.toUpperCase() || '?'}</span>
                      )}
                    </div>
                  ))}
                  {(d.currentGuests || 0) > 3 && (
                    <div className="w-6 h-6 rounded-full bg-charcoal-100 border-2 border-white flex items-center justify-center text-charcoal-500 text-[8px] font-bold">+{d.currentGuests - 3}</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom Invite Banner */}
      <div className="bg-brand-50 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
            <Gift size={20} className="text-brand-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-charcoal-900">Invite your friends and get rewards!</p>
            <p className="text-xs text-charcoal-400">You get $2 when they join their first dinner.</p>
          </div>
        </div>
        <button className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors shrink-0">
          Invite Friends
        </button>
      </div>
    </div>
  );
};

export default HomePage;
