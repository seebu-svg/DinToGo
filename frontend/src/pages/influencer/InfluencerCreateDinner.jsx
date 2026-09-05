import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dinnersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  UtensilsCrossed, Calendar, MapPin, Users, DollarSign, Clock,
  Image, Tag, FileText, ChevronDown, Plus, X, Globe, Lock,
  Loader,
} from 'lucide-react';

const cuisineOptions = [
  'Italian', 'Japanese', 'Mexican', 'Indian', 'Thai', 'Chinese', 'Korean',
  'Mediterranean', 'French', 'American', 'BBQ', 'Seafood', 'Vegan',
  'Middle Eastern', 'Turkish', 'Lebanese', 'Pakistani', 'Continental',
  'Fusion', 'Desserts', 'Brunch', 'Street Food',
];

const categoryOptions = [
  { value: 'casual', label: 'Casual' },
  { value: 'fine-dining', label: 'Fine Dining' },
  { value: 'themed', label: 'Themed' },
  { value: 'networking', label: 'Networking' },
  { value: 'celebration', label: 'Celebration' },
  { value: 'influencer', label: 'Influencer' },
  { value: 'pop-up', label: 'Pop-up' },
];

const InfluencerCreateDinner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 120,
    venue: '',
    address: '',
    city: user?.location?.city || '',
    type: 'public',
    category: 'influencer',
    maxGuests: 20,
    price: 0,
    currency: 'USD',
    cuisine: [],
    coverImage: '',
    tags: [],
    dietaryOptions: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [cuisineOpen, setCuisineOpen] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const toggleCuisine = (c) => {
    setForm(prev => ({
      ...prev,
      cuisine: prev.cuisine.includes(c)
        ? prev.cuisine.filter(x => x !== c)
        : [...prev.cuisine, c].slice(0, 5),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && form.tags.length < 8) {
      set('tags', [...form.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date || !form.maxGuests) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        date: form.time ? `${form.date}T${form.time}` : `${form.date}T19:00`,
        isInfluencerHosted: true,
        influencerHostId: user.id,
        hostId: user.id,
      };
      await dinnersAPI.create(payload);
      toast.success('Dinner created successfully!');
      navigate('/influencer/dinners');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create dinner.');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal-900">Create Dinner</h1>
        <p className="text-charcoal-400 text-sm mt-1">Schedule a new dining experience for your followers.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-bold text-charcoal-900 flex items-center gap-2">
            <FileText size={18} className="text-brand-500" /> Basic Information
          </h2>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Title *</label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g., Italian Night with Chef Marco"
              className="input-field"
              maxLength={120}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe the dining experience, menu highlights, ambiance..."
              className="input-field"
              rows={4}
              maxLength={2000}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="input-field">
                {categoryOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Visibility</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => set('type', 'public')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    form.type === 'public' ? 'bg-brand-500 text-white' : 'bg-cream-50 text-charcoal-500 border border-charcoal-100'
                  }`}
                >
                  <Globe size={16} /> Public
                </button>
                <button
                  type="button"
                  onClick={() => set('type', 'private')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    form.type === 'private' ? 'bg-brand-500 text-white' : 'bg-cream-50 text-charcoal-500 border border-charcoal-100'
                  }`}
                >
                  <Lock size={16} /> Private
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Date & Location */}
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-bold text-charcoal-900 flex items-center gap-2">
            <MapPin size={18} className="text-brand-500" /> Date & Location
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Date *</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Time</label>
              <input type="time" value={form.time} onChange={e => set('time', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Duration (min)</label>
              <input type="number" value={form.duration} onChange={e => set('duration', +e.target.value)} className="input-field" min={30} max={600} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Venue</label>
              <input value={form.venue} onChange={e => set('venue', e.target.value)} placeholder="Restaurant name or venue" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">City</label>
              <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="City" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Address</label>
            <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Full address" className="input-field" />
          </div>
        </div>

        {/* Capacity & Pricing */}
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-bold text-charcoal-900 flex items-center gap-2">
            <Users size={18} className="text-brand-500" /> Capacity & Pricing
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Max Guests *</label>
              <input type="number" value={form.maxGuests} onChange={e => set('maxGuests', +e.target.value)} className="input-field" min={1} max={500} />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Price per Seat</label>
              <input type="number" value={form.price} onChange={e => set('price', +e.target.value)} className="input-field" min={0} step={0.01} />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">Currency</label>
              <select value={form.currency} onChange={e => set('currency', e.target.value)} className="input-field">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="PKR">PKR (Rs.)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cuisine & Tags */}
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-bold text-charcoal-900 flex items-center gap-2">
            <Tag size={18} className="text-brand-500" /> Cuisine & Tags
          </h2>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Cuisine Types (select up to 5)</label>
            <div className="flex flex-wrap gap-2">
              {cuisineOptions.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCuisine(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    form.cuisine.includes(c)
                      ? 'bg-brand-500 text-white'
                      : 'bg-cream-50 text-charcoal-500 hover:bg-cream-100 border border-charcoal-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Tags</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add a tag (e.g., outdoor, live-music)"
                className="input-field flex-1"
              />
              <button type="button" onClick={addTag} className="btn-outline text-xs px-4 py-2.5 rounded-xl">Add</button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-medium">
                    {t}
                    <button type="button" onClick={() => set('tags', form.tags.filter((_, j) => j !== i))} className="text-brand-400 hover:text-brand-700">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h2 className="font-bold text-charcoal-900 flex items-center gap-2">
            <Image size={18} className="text-brand-500" /> Cover Image
          </h2>
          <input
            value={form.coverImage}
            onChange={e => set('coverImage', e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="input-field"
          />
          {form.coverImage && (
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
              <img src={form.coverImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/influencer/dinners')}
            className="btn-ghost text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            {submitting ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
            {submitting ? 'Creating...' : 'Create Dinner'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InfluencerCreateDinner;
