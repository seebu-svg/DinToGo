import { Link } from 'react-router-dom';
import { Star, Users } from 'lucide-react';

const InfluencerCard = ({ user }) => {
  const { id, name, avatar, bio, followerCount, influencerData } = user;

  return (
    <Link to={`/profile/${id}`} className="card group block text-center p-6">
      <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          name?.charAt(0)?.toUpperCase()
        )}
      </div>
      <h3 className="font-semibold text-charcoal-900 text-lg">{name}</h3>
      {influencerData?.niche && (
        <span className="badge-orange mt-2">{influencerData.niche}</span>
      )}
      {bio && <p className="text-sm text-charcoal-400 mt-2 line-clamp-2">{bio}</p>}
      <div className="flex items-center justify-center gap-4 mt-4 text-sm text-charcoal-500">
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{followerCount || 0} followers</span>
        </div>
        {influencerData?.verified && (
          <span className="badge bg-blue-50 text-blue-600">Verified</span>
        )}
      </div>
    </Link>
  );
};

export default InfluencerCard;
