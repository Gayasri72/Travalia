import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from './DashSidebar';
import DashProfile from './DashProfile';
import Packages from '../../pages/Admin/Packages';

import Booking from '../../pages/Booking';
import BookingConfirm from '../../pages/Admin/BookingConfirm';
import DefinedTourBooking from '../../pages/Admin/DefinedTourBooking';

import DashUsers from './DashUsers';
import Plans from '../../pages/Plans';
import Aitours from '../../pages/Admin/Aitours';
import MyReview from '../../pages/Myreview';
import AllReview from '../../pages/Admin/AllReview';




import AdminVehicles from '../../pages/Admin/AdminVehicles';
import HireData from '../../pages/Admin/HireData';


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
      {/*packages*/}
      {tab === 'packages' && <Packages />}

      {tab === 'My Bookings'&& <Booking/>} 
      {tab === 'Booking Confirmations'&& <BookingConfirm/>} 
      {tab === 'Predefined Tours'&& <DefinedTourBooking/>} 
      {tab === 'My Plans'&& <Plans/>} 
      {tab === 'Ai-tours'&& <Aitours/>}
      {tab=== 'My Reviews' && <MyReview/>} 
      {tab=== 'reviews' && <AllReview/>}
      {/*users*/}
      {tab === 'users' && <DashUsers />}

      {/*vehicles*/}
      {tab === 'vehicles' && <AdminVehicles/>}
  {tab === 'hire' && <HireData/>}

    
   

    </div>
  );
}
