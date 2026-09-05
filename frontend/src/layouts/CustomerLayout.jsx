import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CustomerLayout = () => {
  const { pathname } = useLocation();
  // Pages that own their full layout (top bar + sidebars)
  const hasOwnShell = pathname === '/' || pathname === '/discover';

  return (
    <div className="min-h-screen bg-cream-50">
      {!hasOwnShell && <Navbar />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;
