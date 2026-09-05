import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UtensilsCrossed, Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return;
    }
    setLoading(true);
    try {
      const data = await register({ name: form.name, email: form.email, password: form.password, role: form.role });
      if (data?.user?.role === 'restaurant') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch {
      // handled in context
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'customer', label: 'Food Lover', desc: 'Discover and join dinners' },
    { value: 'influencer', label: 'Influencer', desc: 'Host and promote dinners' },
    { value: 'restaurant', label: 'Restaurant', desc: 'Manage your venue & offers' },
  ];

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-charcoal-900 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&h=900&fit=crop"
          alt="Dining together"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 flex flex-col justify-center p-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center">
              <UtensilsCrossed size={24} className="text-white" />
            </div>
            <span className="text-3xl font-display font-bold text-white">DinToGo</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Join the Social Dining Revolution
          </h1>
          <p className="text-lg text-charcoal-300 max-w-md">
            Create your account and start exploring unique dining experiences,
            connect with food enthusiasts, and build unforgettable memories.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-cream-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
              <UtensilsCrossed size={20} className="text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-charcoal-900">DinToGo</span>
          </div>

          <h2 className="text-3xl font-display font-bold text-charcoal-900 mb-2">Create your account</h2>
          <p className="text-charcoal-400 mb-8">Start your social dining experience today.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`p-3 rounded-2xl border-2 text-center transition-all ${
                      form.role === r.value
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-charcoal-100 hover:border-charcoal-200'
                    }`}
                  >
                    <p className="text-sm font-semibold text-charcoal-800">{r.label}</p>
                    <p className="text-xs text-charcoal-400 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-field pr-12"
                  placeholder="Min. 8 characters"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Repeat password"
                required
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || form.password !== form.confirmPassword}
              className="btn-primary w-full text-center"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-charcoal-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
