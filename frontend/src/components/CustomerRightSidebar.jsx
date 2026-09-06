import { Link, useLocation } from 'react-router-dom';
import {
  Star, MapPin, Calendar, UserCheck, Gift, Tag, Wine,
  Users, TrendingUp, Sparkles, ChefHat,
} from 'lucide-react';

const popularInfluencers = [
  { id: 1, name: 'Foodieshehryar', role: 'Food Blogger', followers: '96K', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', verified: true },
  { id: 2, name: 'Bites By Sana', role: 'Food Creator', followers: '82K', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', verified: true },
  { id: 3, name: 'Hungry Traveller', role: 'Travel & Food', followers: '128K', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', verified: true },
];

const exclusiveOffers = [
  { title: '20% OFF', desc: 'For groups of 4+ people', venue: 'Mamma Mia, Gulberg', icon: Tag, validTill: '31 May' },
  { title: 'Free Dessert', desc: 'First-time users', venue: 'The Forest Bistro', icon: Gift, validTill: '15 Jun' },
  { title: 'Happy Hours', desc: '15% OFF on drinks', venue: 'Café Botanica', icon: Wine, validTill: '4–7 PM' },
];

const trendingCuisines = [
  { label: 'Italian', img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=80&h=80&fit=crop' },
  { label: 'Asian', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=80&h=80&fit=crop' },
  { label: 'Middle East', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=80&h=80&fit=crop' },
  { label: 'Mexican', img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=80&h=80&fit=crop' },
];

const suggestedPeople = [
  { id: 1, name: 'Ahmed Khan', role: 'Food Enthusiast', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face' },
  { id: 2, name: 'Sara Ali', role: 'Home Chef', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face' },
  { id: 3, name: 'Usman Tariq', role: 'Foodie', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face' },
];

const upcomingDinners = [
  { id: 1, title: 'Italian Night', date: 'Tonight, 7 PM', venue: 'Mamma Mia' },
  { id: 2, title: 'Sushi Experience', date: 'Tomorrow, 8 PM', venue: 'Sakura' },
];

const CustomerRightSidebar = () => {
  const { pathname } = useLocation();

  // Determine which sections to show based on current page
  const showInfluencers = pathname === '/' || pathname === '/discover' || pathname === '/influencers';
  const showOffers = pathname === '/' || pathname === '/discover' || pathname === '/restaurants';
  const showPeople = pathname === '/' || pathname === '/people' || pathname === '/discover';
  const showUpcoming = pathname === '/' || pathname === '/dinners';
  const showCuisines = pathname === '/discover' || pathname === '/restaurants';

  return (
    <aside className="hidden xl:block w-72 shrink-0 border-l border-charcoal-100 bg-white sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Popular Influencers */}
        {showInfluencers && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-charcoal-900 flex items-center gap-1.5">
                <Star size={14} className="text-brand-500" />
                Popular Influencers
              </h3>
              <Link to="/influencers" className="text-brand-500 text-xs font-medium hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-2.5">
              {popularInfluencers.map((inf) => (
                <div key={inf.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-cream-50 transition-colors">
                  <img src={inf.avatar} alt={inf.name} className="w-9 h-9 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-semibold text-charcoal-900 truncate">{inf.name}</p>
                      {inf.verified && <UserCheck size={11} className="text-blue-500 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-charcoal-400">{inf.followers} followers</p>
                  </div>
                  <button className="text-brand-500 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-brand-200 hover:bg-brand-50 transition-colors shrink-0">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommended People */}
        {showPeople && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-charcoal-900 flex items-center gap-1.5">
                <Users size={14} className="text-brand-500" />
                Suggested Connections
              </h3>
              <Link to="/people" className="text-brand-500 text-xs font-medium hover:underline">
                See All
              </Link>
            </div>
            <div className="space-y-2.5">
              {suggestedPeople.map((p) => (
                <div key={p.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-cream-50 transition-colors">
                  <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-charcoal-900 truncate">{p.name}</p>
                    <p className="text-[10px] text-charcoal-400">{p.role}</p>
                  </div>
                  <button className="text-brand-500 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-brand-200 hover:bg-brand-50 transition-colors shrink-0">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Restaurant Offers */}
        {showOffers && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-charcoal-900 flex items-center gap-1.5">
                <Gift size={14} className="text-brand-500" />
                Exclusive Offers
              </h3>
              <Link to="/discover" className="text-brand-500 text-xs font-medium hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {exclusiveOffers.map((o, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 bg-cream-50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
                    <o.icon size={14} className="text-brand-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-charcoal-900">{o.title}</p>
                    <p className="text-[10px] text-charcoal-500">{o.desc}</p>
                    <p className="text-[9px] text-charcoal-400 mt-0.5">{o.venue} • {o.validTill}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Dinners */}
        {showUpcoming && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-charcoal-900 flex items-center gap-1.5">
                <Calendar size={14} className="text-brand-500" />
                Upcoming Dinners
              </h3>
              <Link to="/dinners" className="text-brand-500 text-xs font-medium hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {upcomingDinners.map((d) => (
                <Link
                  key={d.id}
                  to={`/dinners/${d.id}`}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-cream-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                    <Calendar size={14} className="text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-charcoal-900 truncate">{d.title}</p>
                    <p className="text-[10px] text-charcoal-400">{d.date} • {d.venue}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trending Cuisines */}
        {showCuisines && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-charcoal-900 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-brand-500" />
                Trending Cuisines
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingCuisines.map((c) => (
                <button
                  key={c.label}
                  className="flex items-center gap-2 px-3 py-1.5 bg-cream-50 hover:bg-brand-50 rounded-full transition-colors group"
                >
                  <img src={c.img} alt={c.label} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-[11px] font-medium text-charcoal-600 group-hover:text-brand-600">
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Trending Experiences (always visible) */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-charcoal-900 flex items-center gap-1.5">
              <Sparkles size={14} className="text-brand-500" />
              Trending Experiences
            </h3>
            <Link to="/discover" className="text-brand-500 text-xs font-medium hover:underline">
              Explore
            </Link>
          </div>
          <div className="space-y-2">
            {[
              { label: "Chef's Table", tag: 'Fine Dining', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=120&fit=crop' },
              { label: 'BBQ Night', tag: 'Popular', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=120&fit=crop' },
            ].map((exp, i) => (
              <Link
                key={i}
                to="/discover"
                className="relative block rounded-xl overflow-hidden group h-20"
              >
                <img
                  src={exp.img}
                  alt={exp.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <p className="text-xs font-bold text-white">{exp.label}</p>
                  <span className="text-[9px] text-white/80 bg-white/20 px-1.5 py-0.5 rounded-full">
                    {exp.tag}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
};

export default CustomerRightSidebar;
