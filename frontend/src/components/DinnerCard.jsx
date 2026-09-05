import { Link } from 'react-router-dom';
import { Users, Calendar, MapPin, Star, Clock } from 'lucide-react';
import { format } from 'date-fns';

const DinnerCard = ({ dinner }) => {
  const { id, title, coverImage, date, location, host, price, maxGuests, currentGuests, type, category, ratings, isInfluencerHosted } = dinner;
  const spotsLeft = maxGuests - currentGuests;
  const isFull = spotsLeft <= 0;

  const placeholderImg = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop';

  return (
    <Link to={`/dinners/${id}`} className="card group block">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={coverImage || placeholderImg}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {type === 'private' && (
            <span className="badge bg-white/90 text-charcoal-800 backdrop-blur-sm">Private</span>
          )}
          {isInfluencerHosted && (
            <span className="badge bg-brand-500/90 text-white backdrop-blur-sm">Influencer</span>
          )}
          {category && category !== 'casual' && (
            <span className="badge bg-white/90 text-charcoal-700 backdrop-blur-sm capitalize">{category}</span>
          )}
        </div>

        {/* Price */}
        {price > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-bold text-charcoal-900">${price}</span>
            <span className="text-xs text-charcoal-500">/person</span>
          </div>
        )}

        {/* Date */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
          <Calendar size={14} />
          <span className="text-sm font-medium">{format(new Date(date), 'MMM d, yyyy')}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-charcoal-900 text-lg mb-1 line-clamp-1">{title}</h3>

        {location?.venue && (
          <div className="flex items-center gap-1 text-charcoal-400 text-sm mb-2">
            <MapPin size={14} />
            <span className="line-clamp-1">{location.venue}{location.city ? `, ${location.city}` : ''}</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold">
              {host?.name?.charAt(0)?.toUpperCase() || 'H'}
            </div>
            <span className="text-sm text-charcoal-500">{host?.name}</span>
          </div>

          <div className="flex items-center gap-3">
            {ratings?.average > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <Star size={14} className="text-brand-500 fill-brand-500" />
                <span className="text-charcoal-600">{ratings.average}</span>
              </div>
            )}
            <div className={`flex items-center gap-1 text-sm ${isFull ? 'text-red-500' : 'text-charcoal-500'}`}>
              <Users size={14} />
              <span>{isFull ? 'Full' : `${spotsLeft} spots`}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DinnerCard;
