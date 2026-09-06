import { useState } from 'react';
import {
  HelpCircle, Search, Book, MessageCircle, FileText,
  ChevronRight, ExternalLink, Phone, Mail, Clock,
  CreditCard, Users, UtensilsCrossed, Star, Settings,
  Shield, TrendingUp, Gift, Calendar,
} from 'lucide-react';

const categories = [
  { id: 'getting-started', title: 'Getting Started', desc: 'Set up your restaurant profile, create your first dinner, and start hosting.', icon: Book, color: 'bg-brand-50 text-brand-600', articles: 12 },
  { id: 'dinners', title: 'Managing Dinners', desc: 'Create, edit, schedule, and manage your dinner events.', icon: UtensilsCrossed, color: 'bg-blue-50 text-blue-600', articles: 8 },
  { id: 'reservations', title: 'Reservations', desc: 'Handle bookings, confirm guests, manage seating and cancellations.', icon: Calendar, color: 'bg-green-50 text-green-600', articles: 6 },
  { id: 'payments', title: 'Payments & Payouts', desc: 'Understand payment processing, payouts, and billing.', icon: CreditCard, color: 'bg-purple-50 text-purple-600', articles: 10 },
  { id: 'marketing', title: 'Marketing & Growth', desc: 'Promote your dinners, use marketing tools, and grow your audience.', icon: TrendingUp, color: 'bg-amber-50 text-amber-600', articles: 15 },
  { id: 'analytics', title: 'Analytics & Insights', desc: 'Track performance, understand your data, and optimize.', icon: Star, color: 'bg-pink-50 text-pink-600', articles: 7 },
  { id: 'collaborations', title: 'Influencer Collabs', desc: 'Partner with food influencers and manage collaborations.', icon: Users, color: 'bg-indigo-50 text-indigo-600', articles: 5 },
  { id: 'security', title: 'Account & Security', desc: 'Manage your account settings, security, and privacy.', icon: Shield, color: 'bg-red-50 text-red-600', articles: 9 },
];

const faqs = [
  { q: 'How do I create my first dinner event?', a: 'Go to Dinners > Create Dinner. Fill in the title, date, time, location, price, and max guests. Add a cover photo and description, then publish.' },
  { q: 'How do payouts work?', a: 'Payouts are processed weekly every Monday for the previous week\'s completed dinners. Minimum payout threshold is Rs. 5,000. Funds are transferred to your linked bank account.' },
  { q: 'Can I cancel a dinner after guests have booked?', a: 'Yes, but guests will be automatically refunded. Frequent cancellations may affect your rating. We recommend reaching out to guests first.' },
  { q: 'How do I invite influencers to collaborate?', a: 'Go to Creator Collaborations > Invite Influencer. Select from available food influencers, set compensation terms, and send an invitation.' },
  { q: 'What happens if a guest doesn\'t show up?', a: 'You can mark them as "No Show" in the Reservations page. No-show policies depend on your cancellation settings.' },
  { q: 'How can I promote my dinners?', a: 'Use our Marketing Tools to create social media posts, email campaigns, flash offers, and referral programs. You can also partner with food influencers.' },
];

const HelpCenterPage = () => {
  const [search, setSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const filteredCategories = categories.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-charcoal-900">Help Center</h1>
        <p className="text-charcoal-400 text-sm mt-1">Find answers, guides, and support for your restaurant dashboard.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-300" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for help articles, guides, FAQs..."
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-charcoal-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 shadow-sm"
        />
      </div>

      {/* Quick Contact */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <MessageCircle size={20} className="text-brand-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-charcoal-900">Live Chat</p>
            <p className="text-xs text-charcoal-400">Avg. response: 2 min</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Mail size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-charcoal-900">Email Support</p>
            <p className="text-xs text-charcoal-400">support@dintogo.com</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Phone size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-charcoal-900">Phone Support</p>
            <p className="text-xs text-charcoal-400">Mon–Fri, 9 AM – 6 PM</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-lg font-bold text-charcoal-900 mb-4">Browse by Category</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCategories.map(({ id, title, desc, icon: Icon, color, articles }) => (
            <div key={id} className="card p-5 group hover:shadow-md transition-shadow cursor-pointer">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-charcoal-900 text-sm mb-1">{title}</h3>
              <p className="text-xs text-charcoal-400 leading-relaxed mb-3 line-clamp-2">{desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-charcoal-400">{articles} articles</span>
                <ChevronRight size={14} className="text-charcoal-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div>
        <h2 className="text-lg font-bold text-charcoal-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-cream-50/50 transition-colors"
              >
                <span className="text-sm font-medium text-charcoal-900 pr-4">{q}</span>
                <ChevronRight
                  size={16}
                  className={`text-charcoal-400 shrink-0 transition-transform ${expandedFaq === i ? 'rotate-90' : ''}`}
                />
              </button>
              {expandedFaq === i && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-sm text-charcoal-500 leading-relaxed bg-cream-50 rounded-xl p-4">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Popular Guides */}
      <div>
        <h2 className="text-lg font-bold text-charcoal-900 mb-4">Popular Guides</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: 'Complete Restaurant Onboarding Guide', time: '10 min read', icon: Book },
            { title: 'How to Set Pricing for Your Dinners', time: '5 min read', icon: CreditCard },
            { title: 'Best Practices for Dinner Descriptions', time: '7 min read', icon: FileText },
            { title: 'Growing Your Follower Base on DinToGo', time: '8 min read', icon: TrendingUp },
          ].map(({ title, time, icon: Icon }, i) => (
            <div key={i} className="card p-4 flex items-center gap-4 group hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-cream-50 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-charcoal-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal-900 truncate">{title}</p>
                <p className="text-[10px] text-charcoal-400">{time}</p>
              </div>
              <ExternalLink size={14} className="text-charcoal-300 group-hover:text-brand-500 transition-colors shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
