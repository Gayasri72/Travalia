import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from './DashSidebar';
import DashProfile from './DashProfile';
import Packages from '../../pages/Admin/Packages';
import AdminVehicles from '../../pages/Admin/AdminVehicles';
import HireDetails from '../../pages/HireDetails';
import AdminDropBookings from '../../pages/Admin/AdminDropBookings';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/*sidebar*/}
        <DashSidebar />
      </div>
      {/*profile*/}
      {tab === 'profile' && <DashProfile />}
      {tab === 'packages' && <Packages />}
      {tab === 'hires' && <AdminVehicles />}
      {tab === 'my-hires' && <HireDetails/>}
      {tab === 'drop' && <AdminDropBookings/>}
      {/* Add more tabs as needed */}
    </div>
  );
}
