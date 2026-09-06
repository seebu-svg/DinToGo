import { useState, useEffect } from 'react';
import { offersAPI } from '../../services/api';
import {
  Tag, Plus, Loader, Percent, Trash2, Edit, Copy, Eye,
  Gift, Clock, Users, TrendingUp, Search, Filter,
  CheckCircle, XCircle, AlertCircle, Calendar,
} from 'lucide-react';
import { format, isPast, isFuture, differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';

const demoOffers = [
  { id: 'o1', title: 'Happy Hour 20% Off', description: '20% off all dinners during weekday evenings', discountType: 'percentage', discountPercent: 20, validFrom: new Date(Date.now() - 7*86400000).toISOString(), validUntil: new Date(Date.now() + 14*86400000).toISOString(), targetAudience: 'all', status: 'active', currentRedemptions: 45, maxRedemptions: 100 },
  { id: 'o2', title: 'Group of 4+ Special', description: 'Free dessert for groups of 4 or more', discountType: 'fixed', discountPercent: 15, validFrom: new Date(Date.now() - 14*86400000).toISOString(), validUntil: new Date(Date.now() + 30*86400000).toISOString(), targetAudience: 'all', status: 'active', currentRedemptions: 28, maxRedemptions: 50 },
  { id: 'o3', title: 'First Timer Welcome', description: '10% off your first dinner on DinToGo', discountType: 'percentage', discountPercent: 10, validFrom: new Date(Date.now() - 30*86400000).toISOString(), validUntil: new Date(Date.now() + 60*86400000).toISOString(), targetAudience: 'new-customers', status: 'active', currentRedemptions: 67, maxRedemptions: 200 },
  { id: 'o4', title: 'Influencer Exclusive', description: '25% off for verified food influencers', discountType: 'percentage', discountPercent: 25, validFrom: new Date(Date.now() - 60*86400000).toISOString(), validUntil: new Date(Date.now() - 5*86400000).toISOString(), targetAudience: 'influencers', status: 'expired', currentRedemptions: 12, maxRedemptions: 50 },
  { id: 'o5', title: 'Weekend Brunch Deal', description: 'Buy 1 Get 1 Free on brunch items', discountType: 'bogo', discountPercent: 50, validFrom: new Date(Date.now() - 90*86400000).toISOString(), validUntil: new Date(Date.now() - 30*86400000).toISOString(), targetAudience: 'all', status: 'expired', currentRedemptions: 89, maxRedemptions: 100 },
];

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState('active');
  const [form, setForm] = useState({
    title: '', description: '', discountType: 'percentage', discountPercent: 20,
    validFrom: '', validUntil: '', targetAudience: 'all',
  });

  useEffect(() => {
    offersAPI.getMy().then(res => {
      const items = res.data?.data || [];
      setOffers(items.length > 0 ? items : demoOffers);
    }).catch(() => {
      setOffers(demoOffers);
    }).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await offersAPI.create({
        ...form,
        discountPercent: parseFloat(form.discountPercent),
        validFrom: new Date(form.validFrom).toISOString(),
        validUntil: new Date(form.validUntil).toISOString(),
      });
      toast.success('Offer created!');
      setShowForm(false);
      setForm({ title: '', description: '', discountType: 'percentage', discountPercent: 20, validFrom: '', validUntil: '', targetAudience: 'all' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create offer');
    }
  };

  const handleDelete = async (id) => {
    try {
      await offersAPI.delete(id);
      toast.success('Offer cancelled');
      setOffers(prev => prev.filter(o => o.id !== id));
    } catch { toast.error('Failed to delete offer'); }
  };

  const activeOffers = offers.filter(o => o.status === 'active' || isFuture(new Date(o.validUntil)));
  const expiredOffers = offers.filter(o => o.status === 'expired' || isPast(new Date(o.validUntil)));
  const displayed = tab === 'active' ? activeOffers : expiredOffers;

  const totalRedemptions = offers.reduce((s, o) => s + (o.currentRedemptions || 0), 0);
  const activeCount = activeOffers.length;

  const audienceLabel = { all: 'All Customers', 'new-customers': 'New Customers', followers: 'Followers', influencers: 'Influencers' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal-900">Offers & Discounts</h1>
          <p className="text-charcoal-400 text-sm mt-1">Create promotions to attract more guests and fill tables.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 shrink-0">
          <Plus size={18} /> Create Offer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCircle size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">{activeCount}</p>
            <p className="text-xs text-charcoal-400">Active Offers</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <Gift size={20} className="text-brand-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">{totalRedemptions}</p>
            <p className="text-xs text-charcoal-400">Total Redemptions</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">{offers.filter(o => o.targetAudience === 'all').length}</p>
            <p className="text-xs text-charcoal-400">General Offers</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <TrendingUp size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">{offers.reduce((s, o) => s + (o.discountPercent || 0), 0) / Math.max(offers.length, 1)}%</p>
            <p className="text-xs text-charcoal-400">Avg Discount</p>
          </div>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-charcoal-900">Create New Offer</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g., Happy Hour 20% Off" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">Discount %</label>
                <input type="number" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} className="input-field" min="1" max="100" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">Valid From</label>
                <input type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">Valid Until</label>
                <input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">Target Audience</label>
                <select value={form.targetAudience} onChange={(e) => setForm({ ...form, targetAudience: e.target.value })} className="input-field">
                  <option value="all">All Customers</option>
                  <option value="new-customers">New Customers</option>
                  <option value="followers">Followers</option>
                  <option value="influencers">Influencers</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Create Offer</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-charcoal-100 rounded-xl p-1 w-fit">
        <button onClick={() => setTab('active')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'active' ? 'bg-brand-500 text-white' : 'text-charcoal-500 hover:text-charcoal-900'}`}>
          Active ({activeOffers.length})
        </button>
        <button onClick={() => setTab('expired')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'expired' ? 'bg-brand-500 text-white' : 'text-charcoal-500 hover:text-charcoal-900'}`}>
          Expired ({expiredOffers.length})
        </button>
      </div>

      {/* Offers Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : displayed.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayed.map((offer) => {
            const daysLeft = differenceInDays(new Date(offer.validUntil), new Date());
            const redemptionPct = offer.maxRedemptions ? Math.round((offer.currentRedemptions / offer.maxRedemptions) * 100) : 0;
            return (
              <div key={offer.id} className="card p-5 relative overflow-hidden">
                {offer.status === 'active' && daysLeft <= 3 && daysLeft >= 0 && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                    {daysLeft}d left
                  </span>
                )}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <Percent size={22} className="text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-charcoal-900 text-sm truncate">{offer.title}</h3>
                    <p className="text-xs text-charcoal-400 mt-0.5">{audienceLabel[offer.targetAudience] || 'All Customers'}</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-brand-600 mb-1">{offer.discountPercent}%</p>
                <p className="text-xs text-charcoal-400 mb-3 line-clamp-2">{offer.description}</p>
                <div className="text-xs text-charcoal-400 mb-3 flex items-center gap-1">
                  <Calendar size={11} /> {format(new Date(offer.validFrom), 'MMM d')} — {format(new Date(offer.validUntil), 'MMM d')}
                </div>
                {/* Redemption Progress */}
                {offer.maxRedemptions > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-charcoal-500">{offer.currentRedemptions} redemptions</span>
                      <span className="text-charcoal-400">{offer.maxRedemptions} max</span>
                    </div>
                    <div className="w-full h-1.5 bg-charcoal-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${redemptionPct}%` }} />
                    </div>
                  </div>
                )}
                {offer.status === 'active' && (
                  <button onClick={() => handleDelete(offer.id)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium">
                    <Trash2 size={12} /> Cancel Offer
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Tag size={40} className="text-charcoal-200 mx-auto mb-3" />
          <p className="text-charcoal-500 font-medium">{tab === 'active' ? 'No active offers' : 'No expired offers'}</p>
          <p className="text-charcoal-400 text-sm mt-1">{tab === 'active' ? 'Create your first promotion to attract more diners.' : 'Expired offers will appear here.'}</p>
        </div>
      )}
    </div>
  );
};

export default OffersPage;
