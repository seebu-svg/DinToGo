import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User, Mail, Lock, MapPin, Phone, Globe, Camera, Eye, EyeOff,
  Bell, Shield, Palette, Moon, Sun, Save, Check, Loader,
} from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || 'Ahsan Ali',
    email: user?.email || 'ahsan@dintogo.com',
    phone: '+92 300 1234567',
    city: 'Lahore',
    bio: 'Food enthusiast | Always exploring new cuisines',
    dateOfBirth: '1995-06-15',
  });

  const [notifications, setNotifications] = useState({
    emailInvites: true,
    pushNotifications: true,
    dinnerReminders: true,
    newFollowers: true,
    promotionalEmails: false,
    weeklyDigest: true,
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    compactMode: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-charcoal-900 mb-1.5">Settings</h1>
        <p className="text-charcoal-400 text-sm">Manage your account preferences and settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 shrink-0">
          <div className="card p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === id
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-50'
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-bold text-charcoal-900">Profile Information</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-brand-100 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-600 text-2xl font-bold">
                        {profile.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-brand-600 transition-colors">
                    <Camera size={13} />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal-900">{profile.name}</p>
                  <p className="text-xs text-charcoal-400">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              {/* Fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
                    <input
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 bg-cream-50 border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
                    <input
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 bg-cream-50 border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">Phone</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
                    <input
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 bg-cream-50 border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">City</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
                    <input
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 bg-cream-50 border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-cream-50 border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  saved ? 'bg-green-500 text-white' : 'bg-brand-500 text-white hover:bg-brand-600'
                }`}
              >
                {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-bold text-charcoal-900">Change Password</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">Current Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      placeholder="Enter current password"
                      className="w-full pl-9 pr-10 py-2.5 bg-cream-50 border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                    />
                    <button onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-500">
                      {showOldPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className="w-full pl-9 pr-10 py-2.5 bg-cream-50 border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                    />
                    <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-500">
                      {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full pl-9 pr-4 py-2.5 bg-cream-50 border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    saved ? 'bg-green-500 text-white' : 'bg-brand-500 text-white hover:bg-brand-600'
                  }`}
                >
                  {saved ? <><Check size={15} /> Updated!</> : <><Lock size={15} /> Update Password</>}
                </button>
              </div>

              <div className="border-t border-charcoal-100 pt-6">
                <h3 className="text-sm font-bold text-charcoal-900 mb-2">Two-Factor Authentication</h3>
                <p className="text-xs text-charcoal-400 mb-3">Add an extra layer of security to your account.</p>
                <button className="px-4 py-2 bg-white border border-charcoal-200 text-charcoal-600 text-sm font-medium rounded-xl hover:border-brand-300 hover:text-brand-600 transition-colors">
                  Enable 2FA
                </button>
              </div>

              <div className="border-t border-charcoal-100 pt-6">
                <h3 className="text-sm font-bold text-red-600 mb-2">Danger Zone</h3>
                <p className="text-xs text-charcoal-400 mb-3">Once deleted, your account cannot be recovered.</p>
                <button className="px-4 py-2 bg-white border border-red-200 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-bold text-charcoal-900">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { key: 'emailInvites', label: 'Email Invitations', desc: 'Receive dinner invitations via email' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Get notified about dinner updates' },
                  { key: 'dinnerReminders', label: 'Dinner Reminders', desc: 'Reminder before upcoming dinners' },
                  { key: 'newFollowers', label: 'New Followers', desc: 'When someone follows you' },
                  { key: 'promotionalEmails', label: 'Promotional Emails', desc: 'Special offers and featured dinners' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of the week\'s best dinners' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-charcoal-900">{label}</p>
                      <p className="text-xs text-charcoal-400">{desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        notifications[key] ? 'bg-brand-500' : 'bg-charcoal-200'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        notifications[key] ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  saved ? 'bg-green-500 text-white' : 'bg-brand-500 text-white hover:bg-brand-600'
                }`}
              >
                {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Preferences</>}
              </button>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-lg font-bold text-charcoal-900">Appearance</h2>
              <div>
                <p className="text-sm font-medium text-charcoal-900 mb-3">Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'light', label: 'Light', icon: Sun },
                    { id: 'dark', label: 'Dark', icon: Moon },
                    { id: 'system', label: 'System', icon: Globe },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setAppearance({ ...appearance, theme: id })}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                        appearance.theme === id
                          ? 'border-brand-500 bg-brand-50 text-brand-600'
                          : 'border-charcoal-100 text-charcoal-500 hover:border-charcoal-200'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-charcoal-900">Compact Mode</p>
                  <p className="text-xs text-charcoal-400">Show more content with less spacing</p>
                </div>
                <button
                  onClick={() => setAppearance({ ...appearance, compactMode: !appearance.compactMode })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    appearance.compactMode ? 'bg-brand-500' : 'bg-charcoal-200'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    appearance.compactMode ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
