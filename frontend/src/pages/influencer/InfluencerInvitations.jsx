import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dinnersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  Mail, Link2, Copy, Users, Calendar, CheckCircle, Clock,
  ExternalLink, Share2, Plus, Loader, Send, X,
} from 'lucide-react';

const InfluencerInvitations = () => {
  const { user } = useAuth();
  const [hostedDinners, setHostedDinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedDinner, setSelectedDinner] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [inviteEmails, setInviteEmails] = useState([]);

  useEffect(() => {
    dinnersAPI.myHostedDinners().then(res => {
      const items = Array.isArray(res.data?.data) ? res.data.data : [];
      setHostedDinners(items.filter(d => new Date(d.date) >= new Date()));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const copyLink = (dinner) => {
    const link = dinner.inviteLink || `${window.location.origin}/dinners/${dinner.id}?invite=${dinner.inviteCode || dinner.id}`;
    navigator.clipboard.writeText(link);
    setCopiedId(dinner.id);
    toast.success('Invite link copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const addEmail = () => {
    if (emailInput.trim() && emailInput.includes('@')) {
      setInviteEmails(prev => [...prev, emailInput.trim()]);
      setEmailInput('');
    }
  };

  const sendInvites = () => {
    if (inviteEmails.length === 0 || !selectedDinner) return;
    toast.success(`Invitations sent to ${inviteEmails.length} people!`);
    setInviteEmails([]);
    setShowInviteModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size={28} className="text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Invitations</h1>
          <p className="text-charcoal-400 text-sm mt-1">Share your dinners and invite your audience.</p>
        </div>
      </div>

      {/* Invite Link Section */}
      <div className="bg-gradient-to-br from-brand-50 to-cream-100 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center shrink-0">
            <Share2 size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-charcoal-900 mb-1">Your Creator Invite Link</h2>
            <p className="text-xs text-charcoal-500 mb-3">Share this link with your audience so they can discover your dinners.</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white rounded-xl px-4 py-2.5 text-sm text-charcoal-600 border border-charcoal-100 truncate">
                {window.location.origin}/influencer/{user?.id || 'profile'}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/influencer/${user?.id || 'profile'}`);
                  toast.success('Profile link copied!');
                }}
                className="p-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-colors"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dinners with Invite Options */}
      <div>
        <h2 className="text-lg font-bold text-charcoal-900 mb-3">Your Upcoming Dinners</h2>
        {hostedDinners.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-card">
            <Calendar size={48} className="text-charcoal-200 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-charcoal-900 mb-1">No upcoming dinners</h3>
            <p className="text-sm text-charcoal-400 mb-4">Create a dinner to start sharing invitations.</p>
            <Link to="/influencer/create-dinner" className="btn-primary text-sm">Create Dinner</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {hostedDinners.map(d => {
              const spotsLeft = (d.maxGuests || 0) - (d.currentGuests || 0);
              return (
                <div key={d.id} className="bg-white rounded-2xl shadow-card p-5">
                  <div className="flex items-start gap-4">
                    <img
                      src={d.coverImage || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&h=120&fit=crop'}
                      alt={d.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-charcoal-900 text-sm">{d.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-charcoal-400 mt-1">
                        <Calendar size={12} /> {format(new Date(d.date), 'EEE, d MMM • h:mm a')}
                        <span className="text-charcoal-200">•</span>
                        <Users size={12} /> {d.currentGuests}/{d.maxGuests} booked
                      </div>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <button
                          onClick={() => copyLink(d)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            copiedId === d.id
                              ? 'bg-green-50 text-green-600 border border-green-200'
                              : 'bg-brand-50 text-brand-600 border border-brand-200 hover:bg-brand-100'
                          }`}
                        >
                          {copiedId === d.id ? <CheckCircle size={12} /> : <Link2 size={12} />}
                          {copiedId === d.id ? 'Copied!' : 'Copy Invite Link'}
                        </button>
                        <button
                          onClick={() => { setSelectedDinner(d); setShowInviteModal(true); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-cream-50 text-charcoal-600 border border-charcoal-100 rounded-full text-xs font-medium hover:bg-cream-100 transition-colors"
                        >
                          <Send size={12} /> Send Invites
                        </button>
                        <Link to={`/dinners/${d.id}`} className="flex items-center gap-1.5 px-3 py-1.5 text-charcoal-400 hover:text-charcoal-700 text-xs font-medium transition-colors">
                          <ExternalLink size={12} /> View Dinner
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Send Invites Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowInviteModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-card-hover max-w-md w-full p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-charcoal-900">Send Invitations</h3>
              <button onClick={() => setShowInviteModal(false)} className="p-1 text-charcoal-400 hover:text-charcoal-700">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-charcoal-500 mb-4">
              Invite people to <strong>{selectedDinner?.title}</strong>
            </p>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addEmail())}
                  placeholder="Enter email addresses..."
                  className="input-field flex-1 text-sm"
                />
                <button onClick={addEmail} className="btn-outline text-xs px-3 py-2.5 rounded-xl">Add</button>
              </div>
              {inviteEmails.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {inviteEmails.map((email, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-medium">
                      {email}
                      <button onClick={() => setInviteEmails(prev => prev.filter((_, j) => j !== i))} className="text-brand-400 hover:text-brand-700">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <button
                onClick={sendInvites}
                disabled={inviteEmails.length === 0}
                className="btn-primary w-full text-sm"
              >
                Send {inviteEmails.length > 0 ? `${inviteEmails.length} ` : ''}Invitation{inviteEmails.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencerInvitations;
