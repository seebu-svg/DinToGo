import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CustomerSidebar from '../components/CustomerSidebar';
import CustomerTopBar from '../components/CustomerTopBar';
import CustomerRightSidebar from '../components/CustomerRightSidebar';

const CustomerLayout = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Left Sidebar */}
      <CustomerSidebar />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <CustomerTopBar searchValue={search} onSearchChange={setSearch} />

        {/* Content + Right Sidebar */}
        <div className="flex-1 flex">
          {/* Center Content */}
          <main className="flex-1 min-w-0 overflow-y-auto">
            <Outlet context={{ search }} />
          </main>

          {/* Right Sidebar / Discovery Panel */}
          <CustomerRightSidebar />
        </div>
      </div>
    </div>
  );
};

export default CustomerLayout;
