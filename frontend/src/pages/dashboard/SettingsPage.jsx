import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, User, Bell, CreditCard, Shield, Save, Loader, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [saving, setSaving] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Account form
  const [accountForm, setAccountForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  // Notification preferences
  const [notifPrefs, setNotifPrefs] = useState({
    emailBookings: true,
    emailCancellations: true,
    emailReviews: true,
    emailCollaborations: true,
    emailOffers: true,
    pushBookings: true,
    pushCancellations: true,
    pushReviews: false,
    pushCollaborations: true,
    pushOffers: false,
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Payout form
  const [payoutForm, setPayoutForm] = useState({
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountHolder: '',
    payoutMethod: 'bank',
  });

  const handleSaveAccount = async () => {
    setSaving(true);
    try {
      await updateProfile(accountForm);
      toast.success('Account settings updated!');
    } catch {
      toast.error('Failed to update account settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved!');
  };

  const handleSavePayout = () => {
    toast.success('Payout settings saved!');
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    toast.success('Password changed successfully!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payouts', label: 'Payouts & Payments', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-charcoal-900 flex items-center gap-3">
          <Settings className="text-brand-500" /> Restaurant Settings
        </h1>
        <p className="text-charcoal-400 mt-1">Manage your account, notifications, and payment preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-charcoal-600 hover:bg-cream-50'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Account Settings */}
          {activeTab === 'account' && (
            <div className="card p-6 space-y-6">
              <h3 className="font-semibold text-charcoal-900 text-lg">Account Information</h3>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-2xl font-bold">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div>
                  <button className="btn-outline text-sm">Change Avatar</button>
                  <p className="text-xs text-charcoal-400 mt-1">JPG or PNG, max 2MB</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">Full Name</label>
                  <input
                    value={accountForm.name}
                    onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">Email</label>
                  <input value={user?.email || ''} className="input-field bg-charcoal-50" disabled />
                  <p className="text-xs text-charcoal-400 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">Phone</label>
                  <input
                    value={accountForm.phone}
                    onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                    className="input-field"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">Role</label>
                  <input value="Restaurant Partner" className="input-field bg-charcoal-50" disabled />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">Bio</label>
                <textarea
                  value={accountForm.bio}
                  onChange={(e) => setAccountForm({ ...accountForm, bio: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Tell diners about yourself..."
                />
              </div>

              <div className="flex justify-end">
                <button onClick={handleSaveAccount} disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Notification Preferences */}
          {activeTab === 'notifications' && (
            <div className="card p-6 space-y-6">
              <h3 className="font-semibold text-charcoal-900 text-lg">Notification Preferences</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-charcoal-700 mb-3">Email Notifications</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'emailBookings', label: 'New Bookings', desc: 'Get notified when a guest makes a reservation' },
                      { key: 'emailCancellations', label: 'Cancellations', desc: 'Get notified when a booking is cancelled' },
                      { key: 'emailReviews', label: 'New Reviews', desc: 'Get notified when a diner leaves a review' },
                      { key: 'emailCollaborations', label: 'Collaboration Updates', desc: 'Updates on influencer collaboration requests' },
                      { key: 'emailOffers', label: 'Offer Redemptions', desc: 'When a customer redeems your offer' },
                    ].map(({ key, label, desc }) => (
                      <label key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-cream-50 cursor-pointer">
                        <div>
                          <p className="text-sm font-medium text-charcoal-900">{label}</p>
                          <p className="text-xs text-charcoal-400">{desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifPrefs[key]}
                          onChange={(e) => setNotifPrefs({ ...notifPrefs, [key]: e.target.checked })}
                          className="rounded border-charcoal-200"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-charcoal-100" />

                <div>
                  <h4 className="text-sm font-semibold text-charcoal-700 mb-3">Push Notifications</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'pushBookings', label: 'New Bookings', desc: 'Instant push for new reservations' },
                      { key: 'pushCancellations', label: 'Cancellations', desc: 'Instant push for cancellations' },
                      { key: 'pushReviews', label: 'New Reviews', desc: 'Push when new reviews are posted' },
                      { key: 'pushCollaborations', label: 'Collaboration Updates', desc: 'Push for collaboration status changes' },
                      { key: 'pushOffers', label: 'Offer Redemptions', desc: 'Push when offers are redeemed' },
                    ].map(({ key, label, desc }) => (
                      <label key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-cream-50 cursor-pointer">
                        <div>
                          <p className="text-sm font-medium text-charcoal-900">{label}</p>
                          <p className="text-xs text-charcoal-400">{desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifPrefs[key]}
                          onChange={(e) => setNotifPrefs({ ...notifPrefs, [key]: e.target.checked })}
                          className="rounded border-charcoal-200"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={handleSaveNotifications} className="btn-primary flex items-center gap-2">
                  <Save size={16} /> Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Payout Settings */}
          {activeTab === 'payouts' && (
            <div className="card p-6 space-y-6">
              <h3 className="font-semibold text-charcoal-900 text-lg">Payout & Payment Settings</h3>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">Payout Method</label>
                <select
                  value={payoutForm.payoutMethod}
                  onChange={(e) => setPayoutForm({ ...payoutForm, payoutMethod: e.target.value })}
                  className="input-field"
                >
                  <option value="bank">Bank Transfer (ACH)</option>
                  <option value="wire">Wire Transfer</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">Bank Name</label>
                  <input
                    value={payoutForm.bankName}
                    onChange={(e) => setPayoutForm({ ...payoutForm, bankName: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Chase, Bank of America"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">Account Holder Name</label>
                  <input
                    value={payoutForm.accountHolder}
                    onChange={(e) => setPayoutForm({ ...payoutForm, accountHolder: e.target.value })}
                    className="input-field"
                    placeholder="Full name on account"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">Account Number</label>
                  <input
                    value={payoutForm.accountNumber}
                    onChange={(e) => setPayoutForm({ ...payoutForm, accountNumber: e.target.value })}
                    className="input-field"
                    placeholder="****1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-1">Routing Number</label>
                  <input
                    value={payoutForm.routingNumber}
                    onChange={(e) => setPayoutForm({ ...payoutForm, routingNumber: e.target.value })}
                    className="input-field"
                    placeholder="9 digits"
                  />
                </div>
              </div>

              <div className="bg-cream-50 rounded-xl p-4 text-sm text-charcoal-500">
                <p className="font-medium text-charcoal-700 mb-1">Payout Schedule</p>
                <p>Payouts are processed weekly every Monday for the previous week's completed dinners. Minimum payout threshold: $50.</p>
              </div>

              <div className="flex justify-end">
                <button onClick={handleSavePayout} className="btn-primary flex items-center gap-2">
                  <Save size={16} /> Save Payout Settings
                </button>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="card p-6 space-y-6">
              <h3 className="font-semibold text-charcoal-900 text-lg">Security</h3>

              <div>
                <h4 className="text-sm font-semibold text-charcoal-700 mb-4">Change Password</h4>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="input-field pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400"
                      >
                        {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="input-field pr-12"
                        placeholder="Min. 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="input-field"
                    />
                    {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                    )}
                  </div>
                  <button onClick={handleChangePassword} className="btn-primary">
                    Change Password
                  </button>
                </div>
              </div>

              <hr className="border-charcoal-100" />

              <div>
                <h4 className="text-sm font-semibold text-charcoal-700 mb-2">Two-Factor Authentication</h4>
                <p className="text-sm text-charcoal-500 mb-3">Add an extra layer of security to your account.</p>
                <button className="btn-outline text-sm">Enable 2FA</button>
              </div>

              <hr className="border-charcoal-100" />

              <div>
                <h4 className="text-sm font-semibold text-charcoal-700 mb-2">Staff Access</h4>
                <p className="text-sm text-charcoal-500 mb-3">Manage team members who can access your restaurant dashboard.</p>
                <button className="btn-outline text-sm">Manage Staff</button>
              </div>

              <hr className="border-charcoal-100" />

              <div>
                <h4 className="text-sm font-semibold text-red-500 mb-2">Danger Zone</h4>
                <p className="text-sm text-charcoal-500 mb-3">Permanently deactivate your restaurant account.</p>
                <button className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                  Deactivate Account
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
