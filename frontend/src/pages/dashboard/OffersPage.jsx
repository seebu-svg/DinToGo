import { useState, useEffect } from 'react';
import { offersAPI } from '../../services/api';
import EmptyState from '../../components/EmptyState';
import { Tag, Plus, Loader, Percent, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', discountType: 'percentage', discountPercent: 20,
    validFrom: '', validUntil: '', targetAudience: 'all',
  });

  useEffect(() => { fetchOffers(); }, []);

  const fetchOffers = async () => {
    try {
      const { data } = await offersAPI.getMy();
      setOffers(data.data || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

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
      fetchOffers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create offer');
    }
  };

  const handleDelete = async (id) => {
    try {
      await offersAPI.delete(id);
      toast.success('Offer cancelled');
      fetchOffers();
    } catch (err) {
      toast.error('Failed to delete offer');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal-900 flex items-center gap-3">
            <Tag className="text-brand-500" /> Offers & Discounts
          </h1>
          <p className="text-charcoal-400 mt-1">Create promotions to attract more guests.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Offer
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card p-6 mb-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g., Happy Hour 20% Off" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Discount % *</label>
              <input type="number" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} className="input-field" min="1" max="100" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Valid From *</label>
              <input type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Valid Until *</label>
              <input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Target Audience</label>
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
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : offers.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center">
                  <Percent size={20} className="text-brand-600" />
                </div>
                <span className={`badge ${offer.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-charcoal-100 text-charcoal-500'}`}>
                  {offer.status}
                </span>
              </div>
              <h3 className="font-semibold text-charcoal-900 mb-1">{offer.title}</h3>
              <p className="text-2xl font-bold text-brand-600 mb-2">{offer.discountPercent}% off</p>
              <p className="text-xs text-charcoal-400">
                {new Date(offer.validFrom).toLocaleDateString()} — {new Date(offer.validUntil).toLocaleDateString()}
              </p>
              <p className="text-xs text-charcoal-400 mt-1">{offer.currentRedemptions} redemptions</p>
              {offer.status === 'active' && (
                <button onClick={() => handleDelete(offer.id)} className="mt-4 text-xs text-red-500 hover:underline flex items-center gap-1">
                  <Trash2 size={12} /> Cancel Offer
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Tag} title="No offers yet" description="Create your first promotion to attract more diners." action={<button onClick={() => setShowForm(true)} className="btn-primary">Create Offer</button>} />
      )}
    </div>
  );
};

export default OffersPage;
