import { useState, useEffect } from 'react';
import { dinnersAPI } from '../../services/api';
import DinnerCard from '../../components/DinnerCard';
import EmptyState from '../../components/EmptyState';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Plus, Loader } from 'lucide-react';

const ManageDinners = () => {
  const [dinners, setDinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDinners();
  }, []);

  const fetchDinners = async () => {
    try {
      const { data } = await dinnersAPI.myHostedDinners();
      setDinners(data.data || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal-900 flex items-center gap-3">
            <UtensilsCrossed className="text-brand-500" /> Manage Dinners
          </h1>
          <p className="text-charcoal-400 mt-1">Create, schedule, and manage your dining events.</p>
        </div>
        <Link to="/dinners/create" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Dinner
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : dinners.length > 0 ? (
        <div className="space-y-4">
          {dinners.map((dinner) => (
            <div key={dinner.id} className="card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src={dinner.coverImage || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop'}
                  alt={dinner.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-charcoal-900 truncate">{dinner.title}</h3>
                <p className="text-sm text-charcoal-400">
                  {new Date(dinner.date).toLocaleDateString()} &middot; {dinner.currentGuests}/{dinner.maxGuests} guests
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${
                  dinner.status === 'scheduled' ? 'bg-blue-50 text-blue-600' :
                  dinner.status === 'active' ? 'bg-green-50 text-green-600' :
                  dinner.status === 'full' ? 'bg-brand-50 text-brand-600' :
                  'bg-charcoal-100 text-charcoal-600'
                }`}>
                  {dinner.status}
                </span>
                <Link to={`/dinners/${dinner.id}`} className="btn-ghost text-sm">View</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={UtensilsCrossed}
          title="No dinners yet"
          description="Create your first dinner event to start accepting reservations."
          action={<Link to="/dinners/create" className="btn-primary">Create Dinner</Link>}
        />
      )}
    </div>
  );
};

export default ManageDinners;
