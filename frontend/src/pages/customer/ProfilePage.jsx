import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usersAPI, dinnersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DinnerCard from '../../components/DinnerCard';
import { UserPlus, UserMinus, MapPin, Calendar, Users, Star, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, updateProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [dinners, setDinners] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !id || id === currentUser?.id;
  const displayUser = isOwnProfile ? currentUser : profile;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (isOwnProfile) {
        setProfile(currentUser);
        // Fetch user's hosted/attending dinners
        try {
          const { data } = await dinnersAPI.myHostedDinners();
          setDinners(data.data || []);
        } catch {
          setDinners([]);
        }
      } else {
        const { data } = await usersAPI.getById(id);
        setProfile(data.data);
        setIsFollowing(currentUser?.following?.includes(id));
      }
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await usersAPI.unfollow(id || currentUser.id);
        setIsFollowing(false);
        toast.success('Unfollowed');
      } else {
        await usersAPI.follow(id || currentUser.id);
        setIsFollowing(true);
        toast.success('Following!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  if (!displayUser) {
    return <div className="page-container text-center py-20"><p className="text-charcoal-400">Profile not found.</p></div>;
  }

  return (
    <div className="page-container max-w-4xl">
      {/* Profile Header */}
      <div className="card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-3xl font-bold">
            {displayUser.avatar ? (
              <img src={displayUser.avatar} alt={displayUser.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              displayUser.name?.charAt(0)?.toUpperCase()
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-charcoal-900">{displayUser.name}</h1>
            <p className="text-charcoal-400 text-sm mt-1">{displayUser.email}</p>

            {displayUser.bio && <p className="text-charcoal-600 mt-3 max-w-lg">{displayUser.bio}</p>}

            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start text-sm text-charcoal-500">
              {displayUser.location?.city && (
                <span className="flex items-center gap-1"><MapPin size={14} /> {displayUser.location.city}</span>
              )}
              <span className="flex items-center gap-1"><Users size={14} /> {displayUser.followerCount || 0} followers</span>
              <span className="flex items-center gap-1">{displayUser.followingCount || 0} following</span>
              {displayUser.role === 'influencer' && (
                <span className="badge-orange">Influencer</span>
              )}
              {displayUser.role === 'restaurant' && (
                <span className="badge-charcoal">Restaurant Partner</span>
              )}
            </div>
          </div>

          <div>
            {isOwnProfile ? (
              <button className="btn-outline flex items-center gap-2 text-sm">
                <Edit3 size={16} /> Edit Profile
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className={`flex items-center gap-2 text-sm ${isFollowing ? 'btn-outline' : 'btn-primary'}`}
              >
                {isFollowing ? <><UserMinus size={16} /> Unfollow</> : <><UserPlus size={16} /> Follow</>}
              </button>
            )}
          </div>
        </div>

        {displayUser.dietaryPreferences?.length > 0 && (
          <div className="mt-6 pt-6 border-t border-charcoal-100">
            <p className="text-sm text-charcoal-500 mb-2">Dietary Preferences</p>
            <div className="flex flex-wrap gap-2">
              {displayUser.dietaryPreferences.map((d) => (
                <span key={d} className="badge-orange">{d}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hosted Dinners */}
      <div>
        <h2 className="section-title text-xl mb-4">
          {isOwnProfile ? 'My Dinners' : `Dinners by ${displayUser.name}`}
        </h2>
        {dinners.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dinners.map((d) => <DinnerCard key={d.id} dinner={d} />)}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-charcoal-400">No dinners hosted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
