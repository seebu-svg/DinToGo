import { useState, useEffect } from 'react';
import { reservationsAPI, restaurantsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarCheck, Check, X, Loader, User, Users, Clock,
  Search, Filter, ChevronLeft, ChevronRight, Eye,
  Phone, Mail, DollarSign, AlertCircle, CheckCheck,
} from 'lucide-react';
import { format, startOfWeek, addDays, isToday, isSameDay, addWeeks, subWeeks } from 'date-fns';
import toast from 'react-hot-toast';

const statusTabs = [
  { id: 'all', label: 'All', color: 'bg-charcoal-100 text-charcoal-600' },
  { id: 'pending', label: 'Pending', color: 'bg-yellow-50 text-yellow-600' },
  { id: 'confirmed', label: 'Confirmed', color: 'bg-blue-50 text-blue-600' },
  { id: 'seated', label: 'Seated', color: 'bg-green-50 text-green-600' },
  { id: 'completed', label: 'Completed', color: 'bg-charcoal-100 text-charcoal-600' },
  { id: 'cancelled', label: 'Cancelled', color: 'bg-red-50 text-red-500' },
];

const demoReservations = [
  { id: 'r1', user: { name: 'Ahmed Khan', email: 'ahmed@email.com', avatar: null }, dinner: { title: 'Italian Night', date: new Date(Date.now() + 2*86400000).toISOString(), time: '7:00 PM' }, partySize: 4, status: 'confirmed', totalPrice: 14000, specialRequests: 'Window seat preferred', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'r2', user: { name: 'Sara Ali', email: 'sara@email.com', avatar: null }, dinner: { title: 'Italian Night', date: new Date(Date.now() + 2*86400000).toISOString(), time: '7:00 PM' }, partySize: 2, status: 'confirmed', totalPrice: 7000, specialRequests: '', createdAt: new Date(Date.now() - 2*86400000).toISOString() },
  { id: 'r3', user: { name: 'Bilal Ahmed', email: 'bilal@email.com', avatar: null }, dinner: { title: 'Sushi & Sake Experience', date: new Date(Date.now() + 5*86400000).toISOString(), time: '8:00 PM' }, partySize: 3, status: 'pending', totalPrice: 16500, specialRequests: 'Allergic to shellfish', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'r4', user: { name: 'Fatima Noor', email: 'fatima@email.com', avatar: null }, dinner: { title: 'Rooftop BBQ Evening', date: new Date(Date.now() + 86400000).toISOString(), time: '6:30 PM' }, partySize: 6, status: 'seated', totalPrice: 16800, specialRequests: '', createdAt: new Date(Date.now() - 3*86400000).toISOString() },
  { id: 'r5', user: { name: 'Usman Tariq', email: 'usman@email.com', avatar: null }, dinner: { title: 'Mediterranean Feast', date: new Date(Date.now() - 3*86400000).toISOString(), time: '7:00 PM' }, partySize: 2, status: 'completed', totalPrice: 6400, specialRequests: '', createdAt: new Date(Date.now() - 7*86400000).toISOString() },
  { id: 'r6', user: { name: 'Ayesha Malik', email: 'ayesha@email.com', avatar: null }, dinner: { title: 'Mediterranean Feast', date: new Date(Date.now() - 3*86400000).toISOString(), time: '7:00 PM' }, partySize: 4, status: 'completed', totalPrice: 12800, specialRequests: 'Birthday celebration', createdAt: new Date(Date.now() - 8*86400000).toISOString() },
  { id: 'r7', user: { name: 'Zain Ul Abideen', email: 'zain@email.com', avatar: null }, dinner: { title: 'Asian Fusion Night', date: new Date(Date.now() - 10*86400000).toISOString(), time: '7:30 PM' }, partySize: 2, status: 'cancelled', totalPrice: 9000, specialRequests: '', createdAt: new Date(Date.now() - 15*86400000).toISOString() },
  { id: 'r8', user: { name: 'Hira Shah', email: 'hira@email.com', avatar: null }, dinner: { title: 'Rooftop BBQ Evening', date: new Date(Date.now() + 86400000).toISOString(), time: '6:30 PM' }, partySize: 2, status: 'confirmed', totalPrice: 5600, specialRequests: '', createdAt: new Date(Date.now() - 86400000).toISOString() },
];

const ReservationsPage = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // list | calendar
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    restaurantsAPI.getMy().then(restRes => {
      const restId = restRes.data?.data?.id;
      if (restId) {
        return reservationsAPI.getByRestaurant(restId);
      }
      throw new Error('No restaurant');
    }).then(res => {
      const items = res.data?.data || [];
      setReservations(items.length > 0 ? items : demoReservations);
    }).catch(() => {
      setReservations(demoReservations);
    }).finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await reservationsAPI.updateStatus(id, { status });
      toast.success(`Reservation ${status}`);
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const filtered = reservations.filter(r => {
    const matchSearch = r.user?.name?.toLowerCase().includes(search.toLowerCase()) || r.dinner?.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const todayCount = reservations.filter(r => isToday(new Date(r.dinner?.date))).length;
  const pendingCount = reservations.filter(r => r.status === 'pending').length;
  const confirmedToday = reservations.filter(r => isToday(new Date(r.dinner?.date)) && r.status === 'confirmed').length;
  const totalGuestsToday = reservations.filter(r => isToday(new Date(r.dinner?.date)) && r.status !== 'cancelled').reduce((s, r) => s + r.partySize, 0);

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    confirmed: 'bg-blue-50 text-blue-600 border-blue-200',
    seated: 'bg-green-50 text-green-600 border-green-200',
    completed: 'bg-charcoal-100 text-charcoal-600 border-charcoal-200',
    cancelled: 'bg-red-50 text-red-500 border-red-200',
    'no-show': 'bg-red-50 text-red-400 border-red-200',
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getReservationsForDay = (day) => reservations.filter(r => isSameDay(new Date(r.dinner?.date), day) && r.status !== 'cancelled');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal-900">Reservations</h1>
          <p className="text-charcoal-400 text-sm mt-1">Manage guest bookings and table assignments.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-brand-500 text-white' : 'bg-white border border-charcoal-100 text-charcoal-500'}`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-brand-500 text-white' : 'bg-white border border-charcoal-100 text-charcoal-500'}`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <CalendarCheck size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">{todayCount}</p>
            <p className="text-xs text-charcoal-400">Today's Bookings</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
            <Clock size={20} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">{pendingCount}</p>
            <p className="text-xs text-charcoal-400">Pending</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCheck size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">{confirmedToday}</p>
            <p className="text-xs text-charcoal-400">Confirmed Today</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <Users size={20} className="text-brand-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-charcoal-900">{totalGuestsToday}</p>
            <p className="text-xs text-charcoal-400">Guests Today</p>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setWeekStart(subWeeks(weekStart, 1))} className="p-2 hover:bg-cream-50 rounded-lg transition-colors">
              <ChevronLeft size={18} className="text-charcoal-500" />
            </button>
            <h3 className="text-sm font-semibold text-charcoal-900">
              {format(weekStart, 'MMM d')} — {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </h3>
            <button onClick={() => setWeekStart(addWeeks(weekStart, 1))} className="p-2 hover:bg-cream-50 rounded-lg transition-colors">
              <ChevronRight size={18} className="text-charcoal-500" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const dayRes = getReservationsForDay(day);
              return (
                <div key={day.toISOString()} className={`rounded-xl p-3 min-h-[120px] ${isToday(day) ? 'bg-brand-50 border border-brand-200' : 'bg-cream-50'}`}>
                  <p className={`text-xs font-semibold mb-2 ${isToday(day) ? 'text-brand-600' : 'text-charcoal-500'}`}>
                    {format(day, 'EEE d')}
                  </p>
                  <div className="space-y-1">
                    {dayRes.slice(0, 3).map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setSelectedReservation(r)}
                        className={`w-full text-left text-[10px] font-medium px-2 py-1 rounded-lg truncate border ${statusColors[r.status] || 'bg-charcoal-50 text-charcoal-600'}`}
                      >
                        {r.user?.name?.split(' ')[0]} · {r.partySize}p
                      </button>
                    ))}
                    {dayRes.length > 3 && (
                      <p className="text-[10px] text-charcoal-400 text-center">+{dayRes.length - 3} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {statusTabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setStatusFilter(id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === id
                  ? 'bg-brand-500 text-white'
                  : 'bg-white border border-charcoal-100 text-charcoal-500 hover:border-charcoal-300'
              }`}
            >
              {label}
              {id === 'pending' && pendingCount > 0 && (
                <span className="ml-1 bg-white/20 text-[10px] font-bold px-1 py-0.5 rounded-full">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guest or dinner..."
            className="pl-9 pr-4 py-2 bg-white border border-charcoal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 w-full sm:w-56"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : filtered.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50 border-b border-charcoal-100">
                <tr>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Guest</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Dinner</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Party</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-left text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Total</th>
                  <th className="px-5 py-3.5 text-right text-[10px] font-bold text-charcoal-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-50">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold shrink-0">
                          {r.user?.name?.charAt(0)?.toUpperCase() || 'G'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-charcoal-900">{r.user?.name}</p>
                          <p className="text-[10px] text-charcoal-400">{r.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-charcoal-700">{r.dinner?.title || 'N/A'}</p>
                      <p className="text-[10px] text-charcoal-400">{r.dinner?.date ? format(new Date(r.dinner.date), 'MMM d') : ''} · {r.dinner?.time}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-charcoal-700 flex items-center gap-1">
                        <Users size={13} className="text-charcoal-400" /> {r.partySize}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColors[r.status] || 'bg-charcoal-100'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-charcoal-900">Rs. {(r.totalPrice || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.status === 'pending' && (
                          <>
                            <button onClick={() => handleStatusChange(r.id, 'confirmed')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Confirm">
                              <Check size={15} />
                            </button>
                            <button onClick={() => handleStatusChange(r.id, 'cancelled')} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Decline">
                              <X size={15} />
                            </button>
                          </>
                        )}
                        {r.status === 'confirmed' && (
                          <button onClick={() => handleStatusChange(r.id, 'seated')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Seat Guest">
                            <Check size={15} />
                          </button>
                        )}
                        {r.status === 'seated' && (
                          <button onClick={() => handleStatusChange(r.id, 'completed')} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Complete">
                            <CheckCheck size={15} />
                          </button>
                        )}
                        <button onClick={() => setSelectedReservation(r)} className="p-1.5 text-charcoal-400 hover:bg-cream-50 rounded-lg transition-colors" title="View Details">
                          <Eye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <CalendarCheck size={40} className="text-charcoal-200 mx-auto mb-3" />
          <p className="text-charcoal-500 font-medium">
            {statusFilter !== 'all' ? `No ${statusFilter} reservations` : 'No reservations yet'}
          </p>
          <p className="text-charcoal-400 text-sm mt-1">
            {statusFilter !== 'all' ? 'Try a different filter.' : 'Reservations will appear here once guests start booking.'}
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-900/50 backdrop-blur-sm" onClick={() => setSelectedReservation(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-charcoal-900">Reservation Details</h3>
              <button onClick={() => setSelectedReservation(null)} className="p-1 text-charcoal-400 hover:text-charcoal-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                  {selectedReservation.user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-charcoal-900">{selectedReservation.user?.name}</p>
                  <p className="text-xs text-charcoal-400">{selectedReservation.user?.email}</p>
                </div>
                <span className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusColors[selectedReservation.status]}`}>
                  {selectedReservation.status}
                </span>
              </div>
              <div className="bg-cream-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-500">Dinner</span>
                  <span className="font-medium text-charcoal-900">{selectedReservation.dinner?.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-500">Date</span>
                  <span className="font-medium text-charcoal-900">{selectedReservation.dinner?.date ? format(new Date(selectedReservation.dinner.date), 'MMM d, yyyy') : 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-500">Time</span>
                  <span className="font-medium text-charcoal-900">{selectedReservation.dinner?.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-500">Party Size</span>
                  <span className="font-medium text-charcoal-900 flex items-center gap-1"><Users size={13} /> {selectedReservation.partySize}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-500">Total</span>
                  <span className="font-bold text-charcoal-900">Rs. {(selectedReservation.totalPrice || 0).toLocaleString()}</span>
                </div>
              </div>
              {selectedReservation.specialRequests && (
                <div className="bg-amber-50 rounded-xl p-3 flex items-start gap-2">
                  <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-700">Special Requests</p>
                    <p className="text-sm text-amber-600">{selectedReservation.specialRequests}</p>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                {selectedReservation.status === 'pending' && (
                  <>
                    <button onClick={() => { handleStatusChange(selectedReservation.id, 'confirmed'); setSelectedReservation(null); }} className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                      <Check size={15} /> Confirm
                    </button>
                    <button onClick={() => { handleStatusChange(selectedReservation.id, 'cancelled'); setSelectedReservation(null); }} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                      <X size={15} /> Decline
                    </button>
                  </>
                )}
                {selectedReservation.status === 'confirmed' && (
                  <button onClick={() => { handleStatusChange(selectedReservation.id, 'seated'); setSelectedReservation(null); }} className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                    <Check size={15} /> Seat Guest
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;
