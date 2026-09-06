import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  User, Camera, MapPin, Phone, Edit3, Save, X, Link2,
  Instagram, Twitter, Youtube, Globe, Award, Heart,
  UtensilsCrossed, Eye, TrendingUp, CheckCircle,
} from 'lucide-react';

const InfluencerProfile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    location: user?.location?.city || '',
  });

  const infData = user?.influencerData || {};
  const followers = user?.followerCount || 0;
  const following = user?.followingCount || 0;

  const handleSave = () => {
    updateProfile({
      ...form,
      location: { city: form.location, country: 'Pakistan' },
    });
    setEditing(false);
  };

  const stats = [
    { label: 'Followers', value: followers.toLocaleString(), icon: Heart },
    { label: 'Following', value: following.toLocaleString(), icon: User },
    { label: 'Dinners Hosted', value: infData.dinnersHosted || '0', icon: UtensilsCrossed },
    { label: 'Avg Rating', value: infData.avgRating || '—', icon: Award },
  ];

  const socials = [
    { icon: Instagram, label: 'Instagram', value: infData.instagram || '@creator', color: 'text-pink-500' },
    { icon: Twitter, label: 'Twitter', value: infData.twitter || '@creator', color: 'text-blue-400' },
    { icon: Youtube, label: 'YouTube', value: infData.youtube || 'Creator Channel', color: 'text-red-500' },
    { icon: Globe, label: 'Website', value: infData.website || 'creator.dintogo.com', color: 'text-charcoal-500' },
  ];

  const specialties = infData.specialties || ['Food Photography', 'Content Creation', 'Recipe Reviews', 'Fine Dining'];
  const achievements = [
    { label: 'First Dinner', icon: CheckCircle, earned: true },
    { label: '100 Followers', icon: Heart, earned: true },
    { label: '1K Followers', icon: TrendingUp, earned: true },
    { label: '10 Dinners Hosted', icon: UtensilsCrossed, earned: infData.dinnersHosted >= 10 },
    { label: '5-Star Rating', icon: Award, earned: true },
    { label: '5K Followers', icon: Eye, earned: false },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=200&fit=crop')] bg-cover bg-center opacity-20" />
        </div>

        {/* Avatar + Info */}
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex items-end gap-5 mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-brand-100 ring-4 ring-white shadow-lg flex items-center justify-center text-brand-600 font-bold text-3xl overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || 'C'
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-500 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-brand-600 transition-colors">
                <Camera size={14} />
              </button>
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-charcoal-900">{user?.name}</h1>
                <span className="bg-brand-50 text-brand-600 text-[10px] font-bold px-2 py-0.5 rounded-full">CREATOR</span>
              </div>
              <p className="text-sm text-charcoal-400 mt-0.5">{user?.email}</p>
            </div>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                editing ? 'bg-green-500 text-white hover:bg-green-600' : 'btn-outline'
              }`}
            >
              {editing ? <><Save size={14} /> Save</> : <><Edit3 size={14} /> Edit Profile</>}
            </button>
          </div>

          {/* Bio */}
          {editing ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-charcoal-500 mb-1 block">Display Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field w-full text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal-500 mb-1 block">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="input-field w-full text-sm resize-none"
                  placeholder="Tell your audience about yourself..."
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-charcoal-500 mb-1 block">Phone</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal-500 mb-1 block">City</label>
                  <input
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    className="input-field w-full text-sm"
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-charcoal-600 leading-relaxed">
              {user?.bio || 'Food creator sharing culinary experiences. Join me on my dining adventures!'}
            </p>
          )}

          {/* Location + Phone */}
          {!editing && (
            <div className="flex items-center gap-4 mt-3 text-xs text-charcoal-400">
              {user?.location?.city && (
                <span className="flex items-center gap-1"><MapPin size={12} /> {user.location.city}</span>
              )}
              {user?.phone && (
                <span className="flex items-center gap-1"><Phone size={12} /> {user.phone}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl shadow-card p-4 text-center">
            <Icon size={18} className="text-brand-500 mx-auto mb-2" />
            <p className="text-xl font-bold text-charcoal-900">{value}</p>
            <p className="text-xs text-charcoal-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Specialties */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <h2 className="font-bold text-charcoal-900 mb-3">Specialties</h2>
        <div className="flex flex-wrap gap-2">
          {specialties.map(s => (
            <span key={s} className="bg-brand-50 text-brand-600 px-3 py-1.5 rounded-full text-xs font-medium">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <h2 className="font-bold text-charcoal-900 mb-3">Social Links</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {socials.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl">
              <Icon size={18} className={color} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-charcoal-400 font-medium">{label}</p>
                <p className="text-sm text-charcoal-700 truncate">{value}</p>
              </div>
              <Link2 size={12} className="text-charcoal-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <h2 className="font-bold text-charcoal-900 mb-3">Achievements</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {achievements.map(a => (
            <div
              key={a.label}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                a.earned
                  ? 'bg-brand-50 border-brand-200'
                  : 'bg-charcoal-50 border-charcoal-100 opacity-50'
              }`}
            >
              <a.icon size={18} className={a.earned ? 'text-brand-500' : 'text-charcoal-300'} />
              <span className={`text-xs font-semibold ${a.earned ? 'text-charcoal-900' : 'text-charcoal-400'}`}>
                {a.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfile;
