import { useState, useEffect } from 'react';
import { collaborationsAPI, usersAPI } from '../../services/api';
import {
  Users, Plus, Check, X, Loader, Send, Star, Instagram,
  Eye, MessageCircle, TrendingUp, DollarSign, Calendar,
  Sparkles, ChevronRight, ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

const demoCollabs = [
  { id: 'c1', influencer: { id: 'i1', name: 'Foodieshehryar', followerCount: 96000, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', influencerData: { niche: 'Food Blogger', role: 'Food Blogger' } }, status: 'accepted', terms: { compensation: 25000, commission: 10, notes: '3 dinner events coverage' }, createdAt: new Date(Date.now() - 10*86400000).toISOString(), performance: { posts: 5, reach: 45000, bookings: 28 } },
  { id: 'c2', influencer: { id: 'i2', name: 'Bites By Sana', followerCount: 82000, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', influencerData: { niche: 'Food Creator', role: 'Food Creator' } }, status: 'accepted', terms: { compensation: 15000, commission: 8, notes: 'Instagram stories + reel' }, createdAt: new Date(Date.now() - 20*86400000).toISOString(), performance: { posts: 3, reach: 28000, bookings: 15 } },
  { id: 'c3', influencer: { id: 'i3', name: 'Hungry Traveller', followerCount: 128000, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', influencerData: { niche: 'Travel & Food', role: 'Travel & Food' } }, status: 'pending', terms: { compensation: 35000, commission: 12, notes: 'Full dinner event coverage + YouTube video' }, createdAt: new Date(Date.now() - 2*86400000).toISOString(), performance: null },
  { id: 'c4', influencer: { id: 'i4', name: 'Spice Route', followerCount: 64000, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', influencerData: { niche: 'Chef & Creator', role: 'Chef & Creator' } }, status: 'completed', terms: { compensation: 20000, commission: 5, notes: 'Co-hosted Asian fusion dinner' }, createdAt: new Date(Date.now() - 45*86400000).toISOString(), performance: { posts: 8, reach: 52000, bookings: 35 } },
  { id: 'c5', influencer: { id: 'i5', name: 'Sweet Tooth Studio', followerCount: 55000, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', influencerData: { niche: 'Pastry Chef', role: 'Pastry Chef' } }, status: 'declined', terms: { compensation: 10000, commission: 5, notes: 'Dessert dinner feature' }, createdAt: new Date(Date.now() - 30*86400000).toISOString(), performance: null },
];

const CollaborationsPage = () => {
  const [collabs, setCollabs] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState('all');
  const [form, setForm] = useState({ influencer: '', compensation: 0, commission: 0, notes: '' });

  useEffect(() => {
    Promise.all([
      collaborationsAPI.getAll().catch(() => ({ data: { data: [] } })),
      usersAPI.getInfluencers({ limit: 20 }).catch(() => ({ data: { data: [] } })),
    ]).then(([collabRes, infRes]) => {
      const c = collabRes.data?.data || [];
      setCollabs(c.length > 0 ? c : demoCollabs);
      setInfluencers(infRes.data?.data || []);
    }).finally(() => setLoading(false));
  }, []);

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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const filtered = tab === 'all' ? collabs : collabs.filter(c => c.status === tab);

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
    accepted: { label: 'Active', color: 'bg-green-50 text-green-600 border-green-200' },
    declined: { label: 'Declined', color: 'bg-red-50 text-red-500 border-red-200' },
    completed: { label: 'Completed', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    cancelled: { label: 'Cancelled', color: 'bg-charcoal-100 text-charcoal-500 border-charcoal-200' },
  };

  const totalInvestment = collabs.reduce((s, c) => s + (c.terms?.compensation || 0), 0);
  const totalBookings = collabs.reduce((s, c) => s + (c.performance?.bookings || 0), 0);
  const activeCount = collabs.filter(c => c.status === 'accepted' || c.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal-900">Creator Collaborations</h1>
          <p className="text-charcoal-400 text-sm mt-1">Partner with food influencers to promote your restaurant.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 shrink-0">
          <Plus size={18} /> Invite Creator
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <Sparkles size={20} className="text-brand-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">{activeCount}</p>
            <p className="text-xs text-charcoal-400">Active Collabs</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <DollarSign size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">Rs. {totalInvestment.toLocaleString()}</p>
            <p className="text-xs text-charcoal-400">Total Investment</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Calendar size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">{totalBookings}</p>
            <p className="text-xs text-charcoal-400">Bookings Generated</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <TrendingUp size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">{collabs.reduce((s, c) => s + (c.performance?.reach || 0), 0).toLocaleString()}</p>
            <p className="text-xs text-charcoal-400">Total Reach</p>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-charcoal-900">Invite a Creator</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">Select Creator</label>
              <select value={form.influencer} onChange={(e) => setForm({ ...form, influencer: e.target.value })} className="input-field" required>
                <option value="">Choose a creator...</option>
                {influencers.map((inf) => (
                  <option key={inf.id} value={inf.id}>{inf.name} ({inf.followerCount || 0} followers)</option>
                ))}
              </select>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">Compensation (Rs.)</label>
                <input type="number" value={form.compensation} onChange={(e) => setForm({ ...form, compensation: e.target.value })} className="input-field" min="0" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">Commission (%)</label>
                <input type="number" value={form.commission} onChange={(e) => setForm({ ...form, commission: e.target.value })} className="input-field" min="0" max="100" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal-600 mb-1.5">Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input-field" rows={2} placeholder="Describe the collaboration..." />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex items-center gap-2"><Send size={16} /> Send Invitation</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border border-charcoal-100 rounded-xl p-1 w-fit">
        {['all', 'pending', 'accepted', 'completed', 'declined'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-brand-500 text-white' : 'text-charcoal-500 hover:text-charcoal-900'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((collab) => {
            const sc = statusConfig[collab.status] || statusConfig.pending;
            return (
              <div key={collab.id} className="card p-5">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img src={collab.influencer?.avatar || ''} alt={collab.influencer?.name} className="w-14 h-14 rounded-2xl object-cover bg-brand-100" />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-charcoal-900">{collab.influencer?.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.color}`}>{sc.label}</span>
                    </div>
                    <p className="text-xs text-charcoal-400">
                      {collab.influencer?.influencerData?.niche || 'Food Creator'} · {(collab.influencer?.followerCount || 0).toLocaleString()} followers
                    </p>
                    {collab.terms?.notes && (
                      <p className="text-xs text-charcoal-500 mt-1">{collab.terms.notes}</p>
                    )}
                    {collab.terms?.compensation > 0 && (
                      <p className="text-xs text-charcoal-400 mt-1">
                        Rs. {collab.terms.compensation.toLocaleString()} + {collab.terms.commission}% commission
                      </p>
                    )}
                  </div>
                  {/* Performance */}
                  {collab.performance && (
                    <div className="flex items-center gap-4 text-center shrink-0">
                      <div>
                        <p className="text-lg font-bold text-charcoal-900">{collab.performance.posts}</p>
                        <p className="text-[10px] text-charcoal-400">Posts</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-charcoal-900">{(collab.performance.reach / 1000).toFixed(0)}K</p>
                        <p className="text-[10px] text-charcoal-400">Reach</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-brand-600">{collab.performance.bookings}</p>
                        <p className="text-[10px] text-charcoal-400">Bookings</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Users size={40} className="text-charcoal-200 mx-auto mb-3" />
          <p className="text-charcoal-500 font-medium">No {tab !== 'all' ? tab : ''} collaborations</p>
          <p className="text-charcoal-400 text-sm mt-1">Invite food creators to promote your restaurant.</p>
        </div>
      )}
    </div>
  );
};

export default CollaborationsPage;
