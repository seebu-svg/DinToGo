import { useState } from 'react';
import {
  Megaphone, Mail, Share2, Gift, TrendingUp, Users,
  Instagram, Twitter, Facebook, Send, BarChart3,
  Sparkles, Target, Eye, MousePointer, Calendar,
  ArrowRight, Check, Copy, Image as ImageIcon,
} from 'lucide-react';

const marketingTools = [
  { id: 'social', title: 'Social Media Posts', desc: 'Create shareable dinner announcements and promotions for Instagram, Twitter, and Facebook.', icon: Share2, color: 'bg-pink-50 text-pink-600', badge: 'Popular' },
  { id: 'email', title: 'Email Campaigns', desc: 'Send targeted emails to your followers and past diners about upcoming events.', icon: Mail, color: 'bg-blue-50 text-blue-600', badge: null },
  { id: 'offers', title: 'Flash Offers', desc: 'Create time-limited offers to fill empty tables quickly with last-minute deals.', icon: Gift, color: 'bg-green-50 text-green-600', badge: 'New' },
  { id: 'referral', title: 'Referral Program', desc: 'Reward customers who bring new diners to your events.', icon: Users, color: 'bg-purple-50 text-purple-600', badge: null },
  { id: 'influencer', title: 'Influencer Outreach', desc: 'Invite food influencers to your dinners in exchange for promotion.', icon: Sparkles, color: 'bg-brand-50 text-brand-600', badge: null },
  { id: 'analytics', title: 'Campaign Analytics', desc: 'Track the performance of your marketing campaigns and promotions.', icon: BarChart3, color: 'bg-amber-50 text-amber-600', badge: null },
];

const templates = [
  { id: 1, title: 'New Dinner Announcement', type: 'Social Post', preview: '🍝 Join us for an exclusive Italian Night! Handmade pasta, fine wines, and great company. Limited seats available — book now on DinToGo!', color: 'from-brand-400 to-brand-600' },
  { id: 2, title: 'Last-Minute Deal', type: 'Flash Offer', preview: '⚡ Tonight only! 30% off rooftop BBQ dinner. 4 seats left. Don\'t miss out — grab yours now on DinToGo!', color: 'from-green-400 to-green-600' },
  { id: 3, title: 'Weekend Special', type: 'Email Campaign', preview: 'This weekend, experience the finest sushi in town. Exclusive sake pairing menu available only for DinToGo diners.', color: 'from-blue-400 to-blue-600' },
];

const MarketingToolsPage = () => {
  const [activeSection, setActiveSection] = useState('tools');
  const [copiedTemplate, setCopiedTemplate] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedTemplate(id);
      setTimeout(() => setCopiedTemplate(null), 2000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-charcoal-900">Marketing Tools</h1>
        <p className="text-charcoal-400 text-sm mt-1">Promote your dinners, engage customers, and grow your audience.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Eye size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">2.4K</p>
            <p className="text-xs text-charcoal-400">Profile Views</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Users size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">184</p>
            <p className="text-xs text-charcoal-400">Followers</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <MousePointer size={20} className="text-brand-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">67%</p>
            <p className="text-xs text-charcoal-400">Conversion Rate</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <TrendingUp size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">+23%</p>
            <p className="text-xs text-charcoal-400">Growth (30d)</p>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-1 bg-white border border-charcoal-100 rounded-xl p-1 w-fit">
        {[
          { id: 'tools', label: 'Tools' },
          { id: 'templates', label: 'Templates' },
          { id: 'campaigns', label: 'My Campaigns' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === id ? 'bg-brand-500 text-white' : 'text-charcoal-500 hover:text-charcoal-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      {activeSection === 'tools' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {marketingTools.map(({ id, title, desc, icon: Icon, color, badge }) => (
            <div key={id} className="card p-5 group hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={22} />
                </div>
                {badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    badge === 'New' ? 'bg-green-50 text-green-600' : 'bg-brand-50 text-brand-600'
                  }`}>
                    {badge}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-charcoal-900 text-sm mb-1">{title}</h3>
              <p className="text-xs text-charcoal-400 leading-relaxed mb-4">{desc}</p>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-700 transition-colors group-hover:gap-2.5">
                Get Started <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Templates */}
      {activeSection === 'templates' && (
        <div className="space-y-4">
          {templates.map(({ id, title, type, preview, color }) => (
            <div key={id} className="card overflow-hidden flex flex-col sm:flex-row">
              <div className={`sm:w-48 bg-gradient-to-br ${color} p-6 flex items-center justify-center shrink-0`}>
                <ImageIcon size={40} className="text-white/50" />
              </div>
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-charcoal-900 text-sm">{title}</h3>
                    <span className="text-[10px] font-medium text-charcoal-400 bg-charcoal-50 px-2 py-0.5 rounded-full">{type}</span>
                  </div>
                </div>
                <p className="text-xs text-charcoal-500 bg-cream-50 rounded-xl p-3 mb-3 italic leading-relaxed">"{preview}"</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(id, preview)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all ${
                      copiedTemplate === id
                        ? 'bg-green-500 text-white'
                        : 'bg-brand-50 text-brand-600 hover:bg-brand-100'
                    }`}
                  >
                    {copiedTemplate === id ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Text</>}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-charcoal-50 text-charcoal-600 hover:bg-charcoal-100 transition-colors">
                    <Send size={13} /> Customize
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campaigns */}
      {activeSection === 'campaigns' && (
        <div className="space-y-4">
          {[
            { name: 'Summer BBQ Promotion', status: 'Active', reach: '1.2K', conversions: 28, startDate: 'Aug 1, 2026', type: 'Social + Email' },
            { name: 'Sushi Night Launch', status: 'Active', reach: '890', conversions: 15, startDate: 'Aug 20, 2026', type: 'Social Post' },
            { name: 'Weekend Brunch Campaign', status: 'Ended', reach: '2.1K', conversions: 42, startDate: 'Jul 15, 2026', type: 'Email' },
            { name: 'Valentine\'s Special', status: 'Draft', reach: '—', conversions: '—', startDate: '—', type: 'Flash Offer' },
          ].map((campaign, i) => (
            <div key={i} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-charcoal-900 text-sm">{campaign.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    campaign.status === 'Active' ? 'bg-green-50 text-green-600' :
                    campaign.status === 'Ended' ? 'bg-charcoal-100 text-charcoal-500' :
                    'bg-yellow-50 text-yellow-600'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                <p className="text-xs text-charcoal-400">{campaign.type} · Started {campaign.startDate}</p>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-lg font-bold text-charcoal-900">{campaign.reach}</p>
                  <p className="text-[10px] text-charcoal-400">Reach</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-brand-600">{campaign.conversions}</p>
                  <p className="text-[10px] text-charcoal-400">Bookings</p>
                </div>
                <button className="p-2 text-charcoal-400 hover:text-charcoal-600 hover:bg-cream-50 rounded-lg transition-colors">
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketingToolsPage;
