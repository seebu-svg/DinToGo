import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  const { id, name, images, coverImage, address, cuisine, rating, totalReviews, priceRange, featured } = restaurant;
  const placeholderImg = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop';

  return (
    <Link to={`/restaurants/${id}`} className="card group block">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={coverImage || images?.[0] || placeholderImg}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {featured && (
          <span className="absolute top-3 left-3 badge bg-brand-500/90 text-white backdrop-blur-sm">Featured</span>
        )}
        {priceRange && (
          <span className="absolute top-3 right-3 badge bg-white/90 text-charcoal-800 backdrop-blur-sm">{priceRange}</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-charcoal-900 text-lg mb-1">{name}</h3>
        {cuisine?.length > 0 && (
          <p className="text-sm text-charcoal-400 mb-2">{cuisine.join(' • ')}</p>
        )}
        <div className="flex items-center justify-between">
          {address?.city && (
            <div className="flex items-center gap-1 text-charcoal-400 text-sm">
              <MapPin size={14} />
              <span>{address.city}</span>
            </div>
          )}
          {rating > 0 && (
            <div className="flex items-center gap-1">
              <Star size={14} className="text-brand-500 fill-brand-500" />
              <span className="text-sm font-semibold text-charcoal-700">{rating}</span>
              <span className="text-xs text-charcoal-400">({totalReviews})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
