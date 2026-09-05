import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dinnersAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  Plus, X, UtensilsCrossed, Globe, Lock, Users, Calendar, MapPin,
  ChefHat, Tag, Clock, DollarSign, FileText, Image, Link2,
  Copy, Check, Sparkles, UserCheck, Star, ArrowRight, Trash2,
} from 'lucide-react';

const categoryOptions = [
  { value: 'casual', label: 'Casual', desc: 'Relaxed dining with friends' },
  { value: 'fine-dining', label: 'Fine Dining', desc: 'Upscale multi-course experience' },
  { value: 'themed', label: 'Themed', desc: 'Unique themed dinner events' },
  { value: 'networking', label: 'Networking', desc: 'Connect over great food' },
  { value: 'influencer', label: 'Influencer', desc: 'Hosted by food influencers' },
  { value: 'pop-up', label: 'Pop-Up', desc: 'Limited-time pop-up dining' },
  { value: 'celebration', label: 'Celebration', desc: 'Special occasion dinners' },
];

const CreateDinnerPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', description: '', date: '', duration: 120, maxGuests: 20, price: 0,
    type: 'public', category: 'casual', isInfluencerHosted: false,
    location: { venue: '', address: '', city: '' },
    cuisine: '', tags: '', menu: [],
  });
  const [loading, setLoading] = useState(false);
  const [createdDinner, setCreatedDinner] = useState(null);
  const [copied, setCopied] = useState(false);
  const [menuItem, setMenuItem] = useState({ name: '', description: '', price: 0 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm({ ...form, [parent]: { ...form[parent], [child]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleToggle = (name) => {
    setForm({ ...form, [name]: !form[name] });
  };

  const addMenuItem = () => {
    if (!menuItem.name.trim()) return;
    setForm({ ...form, menu: [...form.menu, { ...menuItem, price: parseFloat(menuItem.price) || 0 }] });
    setMenuItem({ name: '', description: '', price: 0 });
  };

  const removeMenuItem = (idx) => {
    setForm({ ...form, menu: form.menu.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        maxGuests: parseInt(form.maxGuests),
        price: parseFloat(form.price),
        duration: parseInt(form.duration),
        cuisine: form.cuisine ? form.cuisine.split(',').map((c) => c.trim()) : [],
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
        date: new Date(form.date).toISOString(),
      };
      const res = await dinnersAPI.create(data);
      setCreatedDinner(res.data.data);
      toast.success('Dinner created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create dinner');
      setLoading(false);
    }
  };

  const copyInviteLink = () => {
    if (createdDinner) {
      const link = `${window.location.origin}/dinners/${createdDinner.id}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Success state after creation
  if (createdDinner) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-charcoal-900 mb-2">Dinner Created!</h1>
          <p className="text-charcoal-400 mb-8">Your dinner "{createdDinner.title}" is now live. Share the invite link with your guests.</p>

          {/* Invite Link */}
          <div className="bg-cream-50 rounded-2xl p-5 mb-6">
            <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wide mb-3">Invite Link</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white border border-charcoal-100 rounded-xl px-4 py-2.5 text-sm text-charcoal-700 truncate">
                {window.location.origin}/dinners/{createdDinner.id}
              </div>
              <button
                onClick={copyInviteLink}
                className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0"
              >
                {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy</>}
              </button>
            </div>
          </div>

          {/* Dinner Summary */}
          <div className="bg-white border border-charcoal-100 rounded-2xl p-5 mb-6 text-left">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-charcoal-400 text-xs">Date & Time</p>
                <p className="font-semibold text-charcoal-900">{new Date(createdDinner.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-charcoal-400 text-xs">Type</p>
                <p className="font-semibold text-charcoal-900 capitalize">{createdDinner.type} • {createdDinner.category}</p>
              </div>
              <div>
                <p className="text-charcoal-400 text-xs">Max Guests</p>
                <p className="font-semibold text-charcoal-900">{createdDinner.maxGuests}</p>
              </div>
              <div>
                <p className="text-charcoal-400 text-xs">Price</p>
                <p className="font-semibold text-charcoal-900">{createdDinner.price > 0 ? `$${createdDinner.price}/person` : 'Free'}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate(`/dinners/${createdDinner.id}`)} className="btn-primary flex-1 flex items-center justify-center gap-2">
              View Dinner <ArrowRight size={16} />
            </button>
            <button onClick={() => { setCreatedDinner(null); setForm({ title: '', description: '', date: '', duration: 120, maxGuests: 20, price: 0, type: 'public', category: 'casual', isInfluencerHosted: false, location: { venue: '', address: '', city: '' }, cuisine: '', tags: '', menu: [] }); setLoading(false); }} className="btn-outline">
              Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-charcoal-900 flex items-center gap-3 mb-2">
          <UtensilsCrossed className="text-brand-500" /> Create a Dinner
        </h1>
        <p className="text-charcoal-400">Host a memorable dining experience. Set up your dinner, add a menu, and share invite links.</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step >= s ? 'bg-brand-500 text-white' : 'bg-charcoal-100 text-charcoal-400'
            }`}>
              {s}
            </div>
            <span className={`text-sm font-medium ${step >= s ? 'text-charcoal-900' : 'text-charcoal-400'}`}>
              {s === 1 ? 'Basics' : s === 2 ? 'Details' : 'Menu & Extras'}
            </span>
            {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-brand-500' : 'bg-charcoal-100'}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basics */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Title */}
            <div className="card p-6">
              <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                <FileText size={14} className="inline mr-1.5 text-brand-500" /> Dinner Title *
              </label>
              <input
                name="title" value={form.title} onChange={handleChange}
                className="input-field text-lg" placeholder="e.g., Sunset Rooftop Italian Dinner"
                required
              />
            </div>

            {/* Description */}
            <div className="card p-6">
              <label className="block text-sm font-semibold text-charcoal-700 mb-2">Description</label>
              <textarea
                name="description" value={form.description} onChange={handleChange}
                className="input-field min-h-[140px]" placeholder="Describe the experience, what guests can expect, the vibe, the food..."
              />
            </div>

            {/* Type Toggle */}
            <div className="card p-6">
              <label className="block text-sm font-semibold text-charcoal-700 mb-3">Dinner Type *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: 'public' })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    form.type === 'public'
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-charcoal-100 hover:border-charcoal-300'
                  }`}
                >
                  <Globe size={24} className={form.type === 'public' ? 'text-brand-500' : 'text-charcoal-400'} />
                  <p className="font-semibold text-charcoal-900 mt-2">Public</p>
                  <p className="text-xs text-charcoal-400 mt-0.5">Anyone can find and join this dinner</p>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: 'private' })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    form.type === 'private'
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-charcoal-100 hover:border-charcoal-300'
                  }`}
                >
                  <Lock size={24} className={form.type === 'private' ? 'text-brand-500' : 'text-charcoal-400'} />
                  <p className="font-semibold text-charcoal-900 mt-2">Private</p>
                  <p className="text-xs text-charcoal-400 mt-0.5">Only people with the invite link can join</p>
                </button>
              </div>

              {/* Influencer toggle */}
              <label className="flex items-center gap-3 mt-4 p-3 bg-cream-50 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isInfluencerHosted}
                  onChange={() => handleToggle('isInfluencerHosted')}
                  className="w-4 h-4 text-brand-500 rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-charcoal-800">Influencer-Hosted Dinner</p>
                  <p className="text-xs text-charcoal-400">Mark this as an influencer-hosted experience</p>
                </div>
                <Sparkles size={16} className="text-brand-500" />
              </label>
            </div>

            {/* Date + Guests + Price */}
            <div className="card p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                    <Calendar size={14} className="inline mr-1.5 text-brand-500" /> Date & Time *
                  </label>
                  <input type="datetime-local" name="date" value={form.date} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                    <Users size={14} className="inline mr-1.5 text-brand-500" /> Max Guests *
                  </label>
                  <input type="number" name="maxGuests" value={form.maxGuests} onChange={handleChange} className="input-field" min="1" max="500" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                    <DollarSign size={14} className="inline mr-1.5 text-brand-500" /> Price per Person
                  </label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} className="input-field" min="0" step="0.01" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate(-1)} className="btn-outline">Cancel</button>
              <button
                type="button"
                onClick={() => form.title.trim() ? setStep(2) : toast.error('Please add a title')}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                Next: Details <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Category */}
            <div className="card p-6">
              <label className="block text-sm font-semibold text-charcoal-700 mb-3">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categoryOptions.map(({ value, label, desc }) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setForm({ ...form, category: value })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      form.category === value
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-charcoal-100 hover:border-charcoal-300'
                    }`}
                  >
                    <p className={`text-sm font-semibold ${form.category === value ? 'text-brand-600' : 'text-charcoal-800'}`}>{label}</p>
                    <p className="text-[10px] text-charcoal-400 mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="card p-6">
              <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                <Clock size={14} className="inline mr-1.5 text-brand-500" /> Duration (minutes)
              </label>
              <input type="number" name="duration" value={form.duration} onChange={handleChange} className="input-field" min="30" />
            </div>

            {/* Location */}
            <div className="card p-6">
              <label className="block text-sm font-semibold text-charcoal-700 mb-3">
                <MapPin size={14} className="inline mr-1.5 text-brand-500" /> Location
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-charcoal-400 mb-1">Venue Name</label>
                  <input name="location.venue" value={form.location.venue} onChange={handleChange} className="input-field" placeholder="e.g., The Rooftop" />
                </div>
                <div>
                  <label className="block text-xs text-charcoal-400 mb-1">Address</label>
                  <input name="location.address" value={form.location.address} onChange={handleChange} className="input-field" placeholder="123 Main St" />
                </div>
                <div>
                  <label className="block text-xs text-charcoal-400 mb-1">City</label>
                  <input name="location.city" value={form.location.city} onChange={handleChange} className="input-field" placeholder="New York" />
                </div>
              </div>
            </div>

            {/* Cuisine & Tags */}
            <div className="card p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                    <ChefHat size={14} className="inline mr-1.5 text-brand-500" /> Cuisine (comma-separated)
                  </label>
                  <input name="cuisine" value={form.cuisine} onChange={handleChange} className="input-field" placeholder="Italian, Mediterranean" />
                  {form.cuisine && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.cuisine.split(',').filter(Boolean).map((c, i) => (
                        <span key={i} className="badge-orange text-[11px]">{c.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">
                    <Tag size={14} className="inline mr-1.5 text-brand-500" /> Tags (comma-separated)
                  </label>
                  <input name="tags" value={form.tags} onChange={handleChange} className="input-field" placeholder="outdoor, wine-pairing, sunset" />
                  {form.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.tags.split(',').filter(Boolean).map((t, i) => (
                        <span key={i} className="badge-charcoal text-[11px]">#{t.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-outline">Back</button>
              <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                Next: Menu <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Menu & Submit */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Menu Builder */}
            <div className="card p-6">
              <label className="block text-sm font-semibold text-charcoal-700 mb-4">
                <UtensilsCrossed size={14} className="inline mr-1.5 text-brand-500" /> Menu Items
              </label>

              {/* Add Menu Item */}
              <div className="bg-cream-50 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-5">
                    <label className="block text-xs text-charcoal-400 mb-1">Item Name *</label>
                    <input
                      value={menuItem.name} onChange={e => setMenuItem({ ...menuItem, name: e.target.value })}
                      className="input-field text-sm" placeholder="e.g., Truffle Pasta"
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="block text-xs text-charcoal-400 mb-1">Description</label>
                    <input
                      value={menuItem.description} onChange={e => setMenuItem({ ...menuItem, description: e.target.value })}
                      className="input-field text-sm" placeholder="Optional description"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-charcoal-400 mb-1">Price ($)</label>
                    <input
                      type="number" value={menuItem.price} onChange={e => setMenuItem({ ...menuItem, price: e.target.value })}
                      className="input-field text-sm" min="0" step="0.01"
                    />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <button type="button" onClick={addMenuItem} className="w-full p-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Menu Items List */}
              {form.menu.length === 0 ? (
                <div className="text-center py-8 text-charcoal-400 text-sm">
                  <UtensilsCrossed size={24} className="mx-auto mb-2 opacity-30" />
                  <p>No menu items yet. Add items above.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {form.menu.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white border border-charcoal-100 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-charcoal-900">{item.name}</p>
                        {item.description && <p className="text-xs text-charcoal-400">{item.description}</p>}
                      </div>
                      <div className="flex items-center gap-3 ml-3">
                        {item.price > 0 && <span className="text-sm font-semibold text-brand-600">${item.price}</span>}
                        <button type="button" onClick={() => removeMenuItem(i)} className="text-red-400 hover:text-red-600 p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary Card */}
            <div className="card p-6">
              <h3 className="font-semibold text-charcoal-800 mb-4">Dinner Summary</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-cream-50 rounded-xl p-3">
                  <p className="text-xs text-charcoal-400">Title</p>
                  <p className="font-semibold text-charcoal-900 truncate">{form.title || '—'}</p>
                </div>
                <div className="bg-cream-50 rounded-xl p-3">
                  <p className="text-xs text-charcoal-400">Type</p>
                  <p className="font-semibold text-charcoal-900 capitalize">{form.type} • {form.category}</p>
                </div>
                <div className="bg-cream-50 rounded-xl p-3">
                  <p className="text-xs text-charcoal-400">Date</p>
                  <p className="font-semibold text-charcoal-900">{form.date ? new Date(form.date).toLocaleDateString() : '—'}</p>
                </div>
                <div className="bg-cream-50 rounded-xl p-3">
                  <p className="text-xs text-charcoal-400">Guests & Price</p>
                  <p className="font-semibold text-charcoal-900">{form.maxGuests} guests • {form.price > 0 ? `$${form.price}` : 'Free'}</p>
                </div>
                <div className="bg-cream-50 rounded-xl p-3 col-span-2">
                  <p className="text-xs text-charcoal-400">Location</p>
                  <p className="font-semibold text-charcoal-900">
                    {[form.location.venue, form.location.address, form.location.city].filter(Boolean).join(', ') || '—'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="btn-outline">Back</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                ) : (
                  <><Check size={16} /> Create Dinner</>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateDinnerPage;
