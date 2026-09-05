import { useState, useEffect } from 'react';
import { collaborationsAPI, usersAPI } from '../../services/api';
import EmptyState from '../../components/EmptyState';
import { Users, Plus, Check, X, Loader, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const CollaborationsPage = () => {
  const [collabs, setCollabs] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ influencer: '', compensation: 0, commission: 0, notes: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [collabRes, infRes] = await Promise.all([
        collaborationsAPI.getAll(),
        usersAPI.getInfluencers({ limit: 20 }),
      ]);
      setCollabs(collabRes.data.data || []);
      setInfluencers(infRes.data.data || []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await collaborationsAPI.create({
        influencer: form.influencer,
        terms: { compensation: parseFloat(form.compensation), commission: parseFloat(form.commission), notes: form.notes },
      });
      toast.success('Collaboration request sent!');
      setShowForm(false);
      setForm({ influencer: '', compensation: 0, commission: 0, notes: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create collaboration');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-600',
    accepted: 'bg-green-50 text-green-600',
    declined: 'bg-red-50 text-red-500',
    completed: 'bg-blue-50 text-blue-600',
    cancelled: 'bg-charcoal-100 text-charcoal-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal-900 flex items-center gap-3">
            <Users className="text-brand-500" /> Influencer Collaborations
          </h1>
          <p className="text-charcoal-400 mt-1">Partner with food influencers to promote your restaurant.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Invite Influencer
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card p-6 mb-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Select Influencer</label>
            <select value={form.influencer} onChange={(e) => setForm({ ...form, influencer: e.target.value })} className="input-field" required>
              <option value="">Choose an influencer...</option>
              {influencers.map((inf) => (
                <option key={inf.id} value={inf.id}>{inf.name} ({inf.followerCount || 0} followers)</option>
              ))}
            </select>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Compensation ($)</label>
              <input type="number" value={form.compensation} onChange={(e) => setForm({ ...form, compensation: e.target.value })} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Commission (%)</label>
              <input type="number" value={form.commission} onChange={(e) => setForm({ ...form, commission: e.target.value })} className="input-field" min="0" max="100" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" rows={2} placeholder="Describe the collaboration..." />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex items-center gap-2"><Send size={16} /> Send Invitation</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : collabs.length > 0 ? (
        <div className="space-y-4">
          {collabs.map((collab) => (
            <div key={collab.id} className="card p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg flex-shrink-0">
                {collab.influencer?.name?.charAt(0)?.toUpperCase() || 'I'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-charcoal-900">{collab.influencer?.name}</h3>
                <p className="text-sm text-charcoal-400">
                  {collab.influencer?.influencerData?.niche || 'Food Influencer'} &middot; {collab.influencer?.followerCount || 0} followers
                </p>
                {collab.terms?.compensation > 0 && (
                  <p className="text-xs text-charcoal-400 mt-1">Compensation: ${collab.terms.compensation} + {collab.terms.commission}% commission</p>
                )}
              </div>
              <span className={`badge ${statusColors[collab.status]}`}>{collab.status}</span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Users} title="No collaborations yet" description="Invite food influencers to promote your restaurant and dinners." action={<button onClick={() => setShowForm(true)} className="btn-primary">Invite Influencer</button>} />
      )}
    </div>
  );
};

export default CollaborationsPage;
