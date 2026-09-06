import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usersAPI, dinnersAPI, resolveImageUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DinnerCard from '../../components/DinnerCard';
import ImageUpload from '../../components/ImageUpload';
import { UserPlus, UserMinus, MapPin, Calendar, Users, Star, Edit3, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, updateProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [dinners, setDinners] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: { city: '', country: '' },
    avatar: '',
    dietaryPreferences: [],
  });

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
        // Initialize edit form with current user data
        setEditForm({
          name: currentUser?.name || '',
          bio: currentUser?.bio || '',
          location: currentUser?.location || { city: '', country: '' },
          avatar: currentUser?.avatar || '',
          dietaryPreferences: currentUser?.dietaryPreferences || [],
        });
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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to current values
    setEditForm({
      name: currentUser?.name || '',
      bio: currentUser?.bio || '',
      location: currentUser?.location || { city: '', country: '' },
      avatar: currentUser?.avatar || '',
      dietaryPreferences: currentUser?.dietaryPreferences || [],
    });
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleAvatarChange = (url) => {
    setEditForm({ ...editForm, avatar: url });
  };

  if (!displayUser) {
    return <div className="page-container text-center py-20"><p className="text-charcoal-400">Profile not found.</p></div>;
  }

  return (
    <div className="page-container max-w-4xl">
      {/* Profile Header */}
      <div className="card p-8 mb-8">
        {isEditing ? (
          /* Edit Mode */
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-charcoal-900">Edit Profile</h2>
              <button
                onClick={handleCancelEdit}
                className="text-charcoal-400 hover:text-charcoal-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <ImageUpload
                value={editForm.avatar}
                onChange={handleAvatarChange}
                endpoint="avatar"
                label="Upload Profile Picture"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300"
                placeholder="Your name"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">Bio</label>
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">City</label>
                <input
                  type="text"
                  value={editForm.location?.city || ''}
                  onChange={(e) => setEditForm({ ...editForm, location: { ...editForm.location, city: e.target.value } })}
                  className="w-full px-4 py-2 border border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">Country</label>
                <input
                  type="text"
                  value={editForm.location?.country || ''}
                  onChange={(e) => setEditForm({ ...editForm, location: { ...editForm.location, country: e.target.value } })}
                  className="w-full px-4 py-2 border border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300"
                  placeholder="Country"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSaveProfile}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Save size={16} /> Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 btn-outline flex items-center justify-center gap-2"
              >
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-3xl font-bold">
              {displayUser.avatar ? (
                <img src={resolveImageUrl(displayUser.avatar)} alt={displayUser.name} className="w-full h-full rounded-full object-cover" />
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
                {displayUser.influencerData && (
                  <span className="badge-orange">Dining Creator</span>
                )}
                {displayUser.role === 'restaurant' && (
                  <span className="badge-charcoal">Restaurant Partner</span>
                )}
              </div>
            </div>

            <div>
              {isOwnProfile ? (
                <button
                  onClick={handleEditClick}
                  className="btn-outline flex items-center gap-2 text-sm"
                >
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
        )}

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
