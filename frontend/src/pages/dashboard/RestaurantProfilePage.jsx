import { useState, useEffect } from 'react';
import { restaurantsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Store, MapPin, Clock, Phone, Mail, Globe, Utensils, Camera, Save, Loader, Edit3, X, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CUISINE_OPTIONS = [
  'Italian', 'Japanese', 'Mexican', 'Indian', 'Chinese', 'Thai', 'French',
  'American', 'Mediterranean', 'Korean', 'Vietnamese', 'Spanish', 'Greek',
  'Turkish', 'Lebanese', 'Ethiopian', 'Brazilian', 'Fusion', 'Seafood',
  'Steakhouse', 'Vegan', 'Vegetarian', 'Gluten-Free', 'Halal', 'Kosher',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const RestaurantProfilePage = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [newImage, setNewImage] = useState('');
  const [newMenuItem, setNewMenuItem] = useState('');

  useEffect(() => { fetchRestaurant(); }, []);

  const fetchRestaurant = async () => {
    try {
      const { data } = await restaurantsAPI.getMy();
      setRestaurant(data.data);
      setForm(data.data);
    } catch {
      // no restaurant yet
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await restaurantsAPI.update(restaurant.id, form);
      setRestaurant(data.data);
      setEditing(false);
      toast.success('Restaurant profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const addImage = () => {
    if (!newImage.trim()) return;
    setForm({ ...form, images: [...(form.images || []), newImage.trim()] });
    setNewImage('');
  };

  const removeImage = (idx) => {
    setForm({ ...form, images: (form.images || []).filter((_, i) => i !== idx) });
  };

  const addMenuItem = () => {
    if (!newMenuItem.trim()) return;
    setForm({ ...form, menuItems: [...(form.menuItems || []), newMenuItem.trim()] });
    setNewMenuItem('');
  };

  const removeMenuItem = (idx) => {
    setForm({ ...form, menuItems: (form.menuItems || []).filter((_, i) => i !== idx) });
  };

  const toggleCuisine = (c) => {
    const current = form.cuisine || [];
    if (current.includes(c)) {
      setForm({ ...form, cuisine: current.filter(x => x !== c) });
    } else {
      setForm({ ...form, cuisine: [...current, c] });
    }
  };

  const toggleAmenity = (a) => {
    const current = form.amenities || [];
    if (current.includes(a)) {
      setForm({ ...form, amenities: current.filter(x => x !== a) });
    } else {
      setForm({ ...form, amenities: [...current, a] });
    }
  };

  const updateHours = (day, field, value) => {
    const hours = { ...(form.hours || {}) };
    hours[day] = { ...(hours[day] || {}), [field]: value };
    setForm({ ...form, hours });
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>;
  }

  if (!restaurant) {
    return (
      <div className="text-center py-20">
        <Store className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-charcoal-900 mb-2">No Restaurant Profile</h2>
        <p className="text-charcoal-400 mb-6">Create your restaurant profile to start managing your presence on DinToGo.</p>
        <button onClick={async () => {
          try {
            const { data } = await restaurantsAPI.create({
              name: user?.restaurantData?.businessName || `${user?.name}'s Restaurant`,
              description: '',
              cuisine: [],
              street: '',
              city: user?.location?.city || '',
              state: '',
              zipCode: '',
              country: user?.location?.country || 'US',
              phone: user?.phone || '',
              email: user?.email || '',
              priceRange: '$$',
              seatingCapacity: 50,
            });
            setRestaurant(data.data);
            setForm(data.data);
            toast.success('Restaurant profile created!');
          } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create profile');
          }
        }} className="btn-primary">
          Create Restaurant Profile
        </button>
      </div>
    );
  }

  const displayData = editing ? form : restaurant;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal-900 flex items-center gap-3">
            <Store className="text-brand-500" /> Restaurant Profile
          </h1>
          <p className="text-charcoal-400 mt-1">Manage your restaurant details, photos, and menu.</p>
        </div>
        {editing ? (
          <div className="flex items-center gap-2">
            <button onClick={() => { setForm(restaurant); setEditing(false); }} className="btn-ghost flex items-center gap-2 text-sm">
              <X size={16} /> Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
              {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Edit3 size={16} /> Edit Profile
          </button>
        )}
      </div>

      {/* Basic Info */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2"><Store size={18} /> Basic Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Restaurant Name</label>
            {editing ? (
              <input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            ) : (
              <p className="text-charcoal-900 font-medium">{displayData.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Price Range</label>
            {editing ? (
              <select value={form.priceRange || '$$'} onChange={(e) => setForm({ ...form, priceRange: e.target.value })} className="input-field">
                <option value="$">$ — Budget</option>
                <option value="$$">$$ — Moderate</option>
                <option value="$$$">$$$ — Upscale</option>
                <option value="$$$$">$$$$ — Fine Dining</option>
              </select>
            ) : (
              <p className="text-charcoal-900 font-medium">{displayData.priceRange}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-charcoal-700 mb-1">Description</label>
          {editing ? (
            <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} />
          ) : (
            <p className="text-charcoal-600 text-sm">{displayData.description || 'No description yet.'}</p>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Seating Capacity</label>
            {editing ? (
              <input type="number" value={form.seatingCapacity || 0} onChange={(e) => setForm({ ...form, seatingCapacity: parseInt(e.target.value) || 0 })} className="input-field" min="1" />
            ) : (
              <p className="text-charcoal-900">{displayData.seatingCapacity || 0} seats</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Featured</label>
            {editing ? (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured || false} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />
                Show as featured restaurant
              </label>
            ) : (
              <p className="text-charcoal-900">{displayData.featured ? 'Yes' : 'No'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Cuisine Types */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2"><Utensils size={18} /> Cuisine Types</h3>
        {editing ? (
          <div className="flex flex-wrap gap-2">
            {CUISINE_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCuisine(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  (form.cuisine || []).includes(c)
                    ? 'bg-brand-500 text-white'
                    : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(displayData.cuisine || []).map((c) => (
              <span key={c} className="badge bg-brand-50 text-brand-600">{c}</span>
            ))}
            {(!displayData.cuisine || displayData.cuisine.length === 0) && (
              <p className="text-charcoal-400 text-sm">No cuisines selected</p>
            )}
          </div>
        )}
      </div>

      {/* Location & Contact */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2"><MapPin size={18} /> Location & Contact</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Street Address</label>
            {editing ? (
              <input value={form.street || ''} onChange={(e) => setForm({ ...form, street: e.target.value })} className="input-field" />
            ) : (
              <p className="text-charcoal-900 text-sm">{displayData.street || '—'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">City</label>
            {editing ? (
              <input value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" />
            ) : (
              <p className="text-charcoal-900 text-sm">{displayData.city || '—'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">State</label>
            {editing ? (
              <input value={form.state || ''} onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field" />
            ) : (
              <p className="text-charcoal-900 text-sm">{displayData.state || '—'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">Zip Code</label>
            {editing ? (
              <input value={form.zipCode || ''} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} className="input-field" />
            ) : (
              <p className="text-charcoal-900 text-sm">{displayData.zipCode || '—'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1 flex items-center gap-1"><Phone size={14} /> Phone</label>
            {editing ? (
              <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
            ) : (
              <p className="text-charcoal-900 text-sm">{displayData.phone || '—'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1 flex items-center gap-1"><Mail size={14} /> Email</label>
            {editing ? (
              <input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
            ) : (
              <p className="text-charcoal-900 text-sm">{displayData.email || '—'}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-charcoal-700 mb-1 flex items-center gap-1"><Globe size={14} /> Website</label>
            {editing ? (
              <input value={form.website || ''} onChange={(e) => setForm({ ...form, website: e.target.value })} className="input-field" placeholder="https://..." />
            ) : (
              <p className="text-charcoal-900 text-sm">{displayData.website || '—'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Hours */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2"><Clock size={18} /> Operating Hours</h3>
        <div className="space-y-2">
          {DAYS.map((day, i) => {
            const key = DAY_KEYS[i];
            return (
            <div key={day} className="flex items-center gap-3 text-sm">
              <span className="w-24 font-medium text-charcoal-700">{day}</span>
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={form.hours?.[key]?.open || ''}
                    onChange={(e) => updateHours(key, 'open', e.target.value)}
                    className="input-field py-1 text-sm w-28"
                  />
                  <span className="text-charcoal-400">to</span>
                  <input
                    type="time"
                    value={form.hours?.[key]?.close || ''}
                    onChange={(e) => updateHours(key, 'close', e.target.value)}
                    className="input-field py-1 text-sm w-28"
                  />
                  <label className="flex items-center gap-1 text-xs text-charcoal-500">
                    <input
                      type="checkbox"
                      checked={form.hours?.[key]?.closed || false}
                      onChange={(e) => updateHours(key, 'closed', e.target.checked)}
                      className="rounded"
                    />
                    Closed
                  </label>
                </div>
              ) : (
                <span className="text-charcoal-600">
                  {displayData.hours?.[key]?.closed
                    ? 'Closed'
                    : displayData.hours?.[key]?.open
                      ? `${displayData.hours[key].open} — ${displayData.hours[key].close}`
                      : 'Not set'}
                </span>
              )}
            </div>
            );
          })}
        </div>
      </div>

      {/* Amenities */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold text-charcoal-900 mb-4">Amenities & Features</h3>
        {editing ? (
          <div className="flex flex-wrap gap-2">
            {['Outdoor Seating', 'Private Dining', 'Wine Bar', 'Rooftop', 'Live Music', 'Valet Parking', 'Wi-Fi', 'Wheelchair Accessible', 'Pet Friendly', 'Kids Menu'].map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  (form.amenities || []).includes(a)
                    ? 'bg-brand-500 text-white'
                    : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(displayData.amenities || []).map((a) => (
              <span key={a} className="badge bg-cream-100 text-charcoal-700">{a}</span>
            ))}
            {(!displayData.amenities || displayData.amenities.length === 0) && (
              <p className="text-charcoal-400 text-sm">No amenities listed</p>
            )}
          </div>
        )}
      </div>

      {/* Photos */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2"><Camera size={18} /> Photos</h3>
        {editing && (
          <div className="flex gap-2 mb-4">
            <input
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              className="input-field flex-1"
              placeholder="Paste image URL..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
            />
            <button type="button" onClick={addImage} className="btn-ghost flex items-center gap-1 text-sm">
              <Plus size={16} /> Add
            </button>
          </div>
        )}
        {(displayData.images || []).length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {(displayData.images || []).map((img, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden aspect-square">
                <img src={img} alt="" className="w-full h-full object-cover" />
                {editing && (
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-charcoal-400 text-sm text-center py-6">No photos yet. Add images to showcase your restaurant.</p>
        )}
      </div>

      {/* Menu Items */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold text-charcoal-900 mb-4">Menu Highlights</h3>
        {editing && (
          <div className="flex gap-2 mb-4">
            <input
              value={newMenuItem}
              onChange={(e) => setNewMenuItem(e.target.value)}
              className="input-field flex-1"
              placeholder="Add a menu highlight (e.g., Truffle Risotto)..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMenuItem())}
            />
            <button type="button" onClick={addMenuItem} className="btn-ghost flex items-center gap-1 text-sm">
              <Plus size={16} /> Add
            </button>
          </div>
        )}
        {(displayData.menuItems || []).length > 0 ? (
          <div className="space-y-2">
            {(displayData.menuItems || []).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-cream-50">
                <span className="text-sm text-charcoal-900">{item}</span>
                {editing && (
                  <button type="button" onClick={() => removeMenuItem(i)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-charcoal-400 text-sm text-center py-6">No menu highlights yet.</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantProfilePage;
