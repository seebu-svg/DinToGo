import { useState } from 'react';
import {
  Gift, Users, Share2, Copy, Check, Sparkles, ArrowRight,
  Instagram, Twitter, MessageCircle, Mail,
} from 'lucide-react';

const InvitePage = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = 'DINTOGO-AHSAN2024';
  const referralLink = `https://dintogo.com/invite/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const stats = [
    { label: 'Friends Invited', value: '12', icon: Users },
    { label: 'Rewards Earned', value: 'Rs. 2,400', icon: Gift },
    { label: 'Active Referrals', value: '5', icon: Sparkles },
  ];

  const shareOptions = [
    { label: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500 hover:bg-green-600' },
    { label: 'Instagram', icon: Instagram, color: 'bg-pink-500 hover:bg-pink-600' },
    { label: 'Twitter', icon: Twitter, color: 'bg-sky-500 hover:bg-sky-600' },
    { label: 'Email', icon: Mail, color: 'bg-charcoal-700 hover:bg-charcoal-800' },
  ];

  const tiers = [
    { invites: 5, reward: 'Rs. 1,000', badge: 'Bronze', color: 'bg-amber-100 text-amber-700' },
    { invites: 10, reward: 'Rs. 2,500', badge: 'Silver', color: 'bg-charcoal-100 text-charcoal-700' },
    { invites: 25, reward: 'Rs. 7,500', badge: 'Gold', color: 'bg-brand-100 text-brand-700' },
    { invites: 50, reward: 'Rs. 20,000 + VIP', badge: 'Platinum', color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 space-y-8">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 p-8 md:p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-brand-200" />
            <span className="text-brand-100 text-sm font-medium">Invite & Earn Program</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
            Invite Friends.<br />Earn Rewards.
          </h1>
          <p className="text-brand-100 text-sm mb-6 max-w-md">
            Share your unique referral link and earn Rs. 200 for every friend who joins their first dinner. The more you invite, the bigger the rewards!
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2">
              <Gift size={16} className="text-brand-200" />
              <span className="text-white text-sm font-medium">Rs. 200 per referral</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2">
              <Users size={16} className="text-brand-200" />
              <span className="text-white text-sm font-medium">No limit on invites</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-5 text-center">
            <Icon size={24} className="text-brand-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-charcoal-900">{value}</p>
            <p className="text-xs text-charcoal-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Referral Link */}
      <section className="card p-6">
        <h2 className="text-lg font-bold text-charcoal-900 mb-1">Your Referral Link</h2>
        <p className="text-sm text-charcoal-400 mb-4">Share this link with friends to earn rewards.</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-cream-50 border border-charcoal-100 rounded-xl px-4 py-3 text-sm text-charcoal-600 font-mono truncate">
            {referralLink}
          </div>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-brand-500 hover:bg-brand-600 text-white'
            }`}
          >
            {copied ? <><Check size={15} /> Copied!</> : <><Copy size={15} /> Copy Link</>}
          </button>
        </div>
        <p className="text-xs text-charcoal-400 mt-2">Referral code: <span className="font-mono font-semibold text-charcoal-600">{referralCode}</span></p>
      </section>

      {/* Share Options */}
      <section>
        <h2 className="text-lg font-bold text-charcoal-900 mb-4">Share Via</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {shareOptions.map(({ label, icon: Icon, color }) => (
            <button
              key={label}
              className={`${color} text-white flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </div>
      </section>

      {/* Reward Tiers */}
      <section>
        <h2 className="text-lg font-bold text-charcoal-900 mb-1">Reward Tiers</h2>
        <p className="text-sm text-charcoal-400 mb-4">Unlock bigger rewards as you invite more friends.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier, i) => (
            <div key={tier.badge} className="card p-5 text-center relative overflow-hidden">
              {i === 2 && (
                <span className="absolute top-3 right-3 text-[9px] font-bold bg-brand-500 text-white px-2 py-0.5 rounded-full">CURRENT</span>
              )}
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${tier.color}`}>
                {tier.badge}
              </span>
              <p className="text-2xl font-bold text-charcoal-900">{tier.invites}</p>
              <p className="text-xs text-charcoal-400 mb-2">friends invited</p>
              <div className="w-full h-1 bg-charcoal-100 rounded-full mb-2">
                <div
                  className="h-full bg-brand-500 rounded-full"
                  style={{ width: `${Math.min(100, (12 / tier.invites) * 100)}%` }}
                />
              </div>
              <p className="text-sm font-semibold text-brand-600">{tier.reward}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="card p-6">
        <h2 className="text-lg font-bold text-charcoal-900 mb-4">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Share Your Link', desc: 'Copy your unique referral link and share it with friends.' },
            { step: '2', title: 'Friend Joins', desc: 'Your friend signs up and joins their first dinner on DinToGo.' },
            { step: '3', title: 'Earn Rewards', desc: 'You earn Rs. 200 instantly. Track your rewards in real-time.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {step}
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal-900">{title}</p>
                <p className="text-xs text-charcoal-400 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default InvitePage;
