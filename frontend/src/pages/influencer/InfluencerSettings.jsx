import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  User, Lock, Bell, Palette, Shield, Eye, EyeOff,
  Save, Mail, Smartphone, Globe, Moon, Sun, Monitor,
  Check, CreditCard, HelpCircle, LogOut, Trash2,
} from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

const InfluencerSettings = () => {
  const { user, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });

  // Notification preferences (local state)
  const [notifPrefs, setNotifPrefs] = useState({
    emailInvites: true,
    emailReviews: false,
    emailPromotions: false,
    pushDinners: true,
    pushFollowers: true,
    pushMessages: true,
    pushOffers: false,
  });

  // Appearance
  const [theme, setTheme] = useState('light');

  const handlePasswordChange = () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) {
      return toast.error('Please fill in all password fields');
    }
    if (pwForm.newPassword !== pwForm.confirm) {
      return toast.error('Passwords do not match');
    }
    if (pwForm.newPassword.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }
    toast.success('Password updated successfully!');
    setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
  };

  const handleNotifChange = (key) => {
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotifs = () => {
    toast.success('Notification preferences saved!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-charcoal-900">Settings</h1>
        <p className="text-charcoal-400 text-sm mt-1">Manage your account preferences.</p>
      </div>

      <div className="flex gap-6">
        {/* Tab Sidebar */}
        <div className="w-48 shrink-0 hidden sm:block">
          <nav className="space-y-1">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === t.id
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-50'
                  }`}
                >
                  <Icon size={16} /> {t.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Tab Selector */}
        <div className="sm:hidden flex gap-1 bg-white rounded-xl p-1 shadow-card w-full overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === t.id ? 'bg-brand-500 text-white' : 'text-charcoal-500'
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
              <h2 className="font-bold text-charcoal-900 text-lg">Profile Settings</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-charcoal-500 mb-1.5 block">Full Name</label>
                  <input defaultValue={user?.name} className="input-field w-full text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal-500 mb-1.5 block">Email</label>
                  <input defaultValue={user?.email} className="input-field w-full text-sm" disabled />
                  <p className="text-[10px] text-charcoal-400 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal-500 mb-1.5 block">Phone</label>
                  <input defaultValue={user?.phone} className="input-field w-full text-sm" placeholder="+92 300 1234567" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal-500 mb-1.5 block">City</label>
                  <input defaultValue={user?.location?.city || ''} className="input-field w-full text-sm" placeholder="Lahore" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal-500 mb-1.5 block">Bio</label>
                <textarea
                  defaultValue={user?.bio}
                  rows={3}
                  className="input-field w-full text-sm resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal-500 mb-1.5 block">Dietary Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'Keto', 'Dairy-Free'].map(d => (
                    <label key={d} className="flex items-center gap-1.5 px-3 py-1.5 bg-cream-50 rounded-full cursor-pointer hover:bg-cream-100 transition-colors">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-charcoal-200 text-brand-500 focus:ring-brand-400" />
                      <span className="text-xs font-medium text-charcoal-600">{d}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={() => toast.success('Profile updated!')} className="btn-primary text-sm flex items-center gap-2">
                <Save size={14} /> Save Changes
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
                <h2 className="font-bold text-charcoal-900 text-lg">Change Password</h2>
                <div>
                  <label className="text-xs font-semibold text-charcoal-500 mb-1.5 block">Current Password</label>
                  <div className="relative">
                    <input
                      type={showOldPw ? 'text' : 'password'}
                      value={pwForm.currentPassword}
                      onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                      className="input-field w-full text-sm pr-10"
                      placeholder="Enter current password"
                    />
                    <button onClick={() => setShowOldPw(!showOldPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400">
                      {showOldPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal-500 mb-1.5 block">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={pwForm.newPassword}
                      onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                      className="input-field w-full text-sm pr-10"
                      placeholder="Enter new password"
                    />
                    <button onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400">
                      {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal-500 mb-1.5 block">Confirm New Password</label>
                  <input
                    type="password"
                    value={pwForm.confirm}
                    onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                    className="input-field w-full text-sm"
                    placeholder="Confirm new password"
                  />
                </div>
                <button onClick={handlePasswordChange} className="btn-primary text-sm">Update Password</button>
              </div>

              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="font-bold text-charcoal-900 text-lg mb-3">Connected Accounts</h2>
                <div className="space-y-3">
                  {[
                    { icon: Mail, label: 'Email', value: user?.email || 'Not connected', connected: true },
                    { icon: Smartphone, label: 'Phone', value: user?.phone || 'Not connected', connected: !!user?.phone },
                  ].map(a => (
                    <div key={a.label} className="flex items-center justify-between p-3 bg-cream-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <a.icon size={18} className="text-charcoal-400" />
                        <div>
                          <p className="text-sm font-semibold text-charcoal-900">{a.label}</p>
                          <p className="text-xs text-charcoal-400">{a.value}</p>
                        </div>
                      </div>
                      {a.connected ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600"><Check size={12} /> Connected</span>
                      ) : (
                        <button className="text-xs font-medium text-brand-500 hover:underline">Connect</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="font-bold text-red-500 text-lg mb-3">Danger Zone</h2>
                <div className="flex items-center justify-between p-3 border border-red-200 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-charcoal-900">Delete Account</p>
                    <p className="text-xs text-charcoal-400">Permanently delete your account and all data</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-card p-6 space-y-6">
              <h2 className="font-bold text-charcoal-900 text-lg">Notification Preferences</h2>

              <div>
                <h3 className="text-sm font-semibold text-charcoal-700 mb-3 flex items-center gap-2">
                  <Mail size={14} /> Email Notifications
                </h3>
                <div className="space-y-3">
                  {[
                    { key: 'emailInvites', label: 'Dinner Invitations', desc: 'Get notified about new dinner invites' },
                    { key: 'emailReviews', label: 'Review Responses', desc: 'When restaurants respond to your reviews' },
                    { key: 'emailPromotions', label: 'Promotions & Offers', desc: 'Special offers and promotional content' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-cream-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-charcoal-900">{item.label}</p>
                        <p className="text-xs text-charcoal-400">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => handleNotifChange(item.key)}
                        className={`w-10 h-6 rounded-full transition-colors ${notifPrefs[item.key] ? 'bg-brand-500' : 'bg-charcoal-200'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${notifPrefs[item.key] ? 'translate-x-5' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-charcoal-700 mb-3 flex items-center gap-2">
                  <Smartphone size={14} /> Push Notifications
                </h3>
                <div className="space-y-3">
                  {[
                    { key: 'pushDinners', label: 'Dinner Updates', desc: 'Reminders and changes to your dinners' },
                    { key: 'pushFollowers', label: 'New Followers', desc: 'When someone follows you' },
                    { key: 'pushMessages', label: 'Messages', desc: 'New direct messages' },
                    { key: 'pushOffers', label: 'Offers & Deals', desc: 'New offers from partner restaurants' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-cream-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-charcoal-900">{item.label}</p>
                        <p className="text-xs text-charcoal-400">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => handleNotifChange(item.key)}
                        className={`w-10 h-6 rounded-full transition-colors ${notifPrefs[item.key] ? 'bg-brand-500' : 'bg-charcoal-200'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${notifPrefs[item.key] ? 'translate-x-5' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleSaveNotifs} className="btn-primary text-sm flex items-center gap-2">
                <Save size={14} /> Save Preferences
              </button>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="bg-white rounded-2xl shadow-card p-6 space-y-6">
              <h2 className="font-bold text-charcoal-900 text-lg">Appearance</h2>

              <div>
                <h3 className="text-sm font-semibold text-charcoal-700 mb-3">Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'light', label: 'Light', icon: Sun, preview: 'bg-white border border-charcoal-100' },
                    { id: 'dark', label: 'Dark', icon: Moon, preview: 'bg-charcoal-900' },
                    { id: 'system', label: 'System', icon: Monitor, preview: 'bg-gradient-to-r from-white to-charcoal-900' },
                  ].map(t => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`p-4 rounded-xl text-center transition-all ${
                          theme === t.id ? 'ring-2 ring-brand-500 ring-offset-2' : 'hover:ring-1 hover:ring-charcoal-200'
                        }`}
                      >
                        <div className={`w-full h-12 rounded-lg ${t.preview} mb-2`} />
                        <Icon size={16} className={`mx-auto mb-1 ${theme === t.id ? 'text-brand-500' : 'text-charcoal-400'}`} />
                        <p className={`text-xs font-semibold ${theme === t.id ? 'text-brand-600' : 'text-charcoal-500'}`}>{t.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-charcoal-700 mb-3">Content Density</h3>
                <div className="flex gap-2">
                  {['Compact', 'Comfortable', 'Spacious'].map(d => (
                    <button
                      key={d}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                        d === 'Comfortable' ? 'bg-brand-500 text-white' : 'bg-cream-50 text-charcoal-500 hover:bg-cream-100'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => toast.success('Appearance saved!')} className="btn-primary text-sm flex items-center gap-2">
                <Save size={14} /> Save Appearance
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfluencerSettings;
