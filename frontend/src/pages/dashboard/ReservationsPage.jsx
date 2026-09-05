import { useState, useEffect } from 'react';
import { reservationsAPI, restaurantsAPI } from '../../services/api';
import EmptyState from '../../components/EmptyState';
import { CalendarCheck, Check, X, Loader, User, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: restData } = await restaurantsAPI.getMy();
      setRestaurant(restData.data);
      const { data } = await reservationsAPI.getByRestaurant(restData.data.id);
      setReservations(data.data || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await reservationsAPI.updateStatus(id, { status });
      toast.success(`Reservation ${status}`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-600',
    confirmed: 'bg-blue-50 text-blue-600',
    seated: 'bg-green-50 text-green-600',
    completed: 'bg-charcoal-100 text-charcoal-600',
    cancelled: 'bg-red-50 text-red-500',
    'no-show': 'bg-red-50 text-red-400',
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-charcoal-900 flex items-center gap-3">
          <CalendarCheck className="text-brand-500" /> Reservations
        </h1>
        <p className="text-charcoal-400 mt-1">Manage customer reservations and bookings.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : reservations.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50 border-b border-charcoal-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-500 uppercase">Guest</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-500 uppercase">Dinner</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-500 uppercase">Party</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-charcoal-500 uppercase">Total</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-charcoal-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-50">
                {reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold">
                          {r.user?.name?.charAt(0)?.toUpperCase() || 'G'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-charcoal-900">{r.user?.name}</p>
                          <p className="text-xs text-charcoal-400">{r.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal-700">{r.dinner?.title || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-charcoal-700 flex items-center gap-1">
                      <Users size={14} /> {r.partySize}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${statusColors[r.status] || 'bg-charcoal-100'}`}>{r.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-charcoal-900">${r.totalPrice}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {r.status === 'confirmed' && (
                          <>
                            <button onClick={() => handleStatusChange(r.id, 'seated')} className="btn-ghost text-xs text-green-600 hover:bg-green-50 p-1.5" title="Seat">
                              <Check size={16} />
                            </button>
                            <button onClick={() => handleStatusChange(r.id, 'cancelled')} className="btn-ghost text-xs text-red-500 hover:bg-red-50 p-1.5" title="Cancel">
                              <X size={16} />
                            </button>
                          </>
                        )}
                        {r.status === 'seated' && (
                          <button onClick={() => handleStatusChange(r.id, 'completed')} className="btn-ghost text-xs text-green-600 hover:bg-green-50 p-1.5" title="Complete">
                            <Check size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState icon={CalendarCheck} title="No reservations yet" description="Reservations will appear here once guests start booking." />
      )}
    </div>
  );
};

export default ReservationsPage;
