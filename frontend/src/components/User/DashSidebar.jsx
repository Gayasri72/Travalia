import { Sidebar } from 'flowbite-react';
import {
  HiArrowSmRight,
  HiUser,
  HiGift,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiDatabase,
  HiOutlineLogout,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import logo from '../../assets/logo.png';

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/users/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess(data));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Sidebar className="w-full md:w-56 min-h-screen bg-white shadow-md border-r">
        {/* Logo and User Info */}
        <div className="flex flex-col items-center py-6 border-b mb-4 bg-gray-50">
          <img src={logo} alt="Travalia Logo" className="w-12 h-12 rounded-full mb-2 shadow" />
          <span className="font-bold text-lg text-gray-800 tracking-wide">Travalia</span>
          {currentUser && (
            <div className="mt-3 text-center">
              <div className="font-semibold text-gray-700 text-sm">{currentUser?.rest?.name || 'User'}</div>
              <div className="text-xs text-gray-500">{currentUser?.rest?.isAdmin ? 'Admin' : 'User'}</div>
            </div>
          )}
        </div>
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col gap-1">
            {/* Account Section */}
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</div>
            <Sidebar.Item
              as={Link}
              to="/dashboard?tab=profile"
              active={tab === 'profile'}
              icon={HiUser}
              label={currentUser?.rest?.isAdmin ? 'Admin' : 'User'}
              labelColor="dark"
              className="rounded-md"
            >
              Profile
            </Sidebar.Item>
            {!currentUser?.rest?.isAdmin && (
              <>
                <Sidebar.Item
                  as={Link}
                  to="/dashboard?tab=My Bookings"
                  active={tab === 'My Bookings'}
                  icon={HiGift}
                  labelColor="dark"
                  className="rounded-md"
                >
                  My Bookings
                </Sidebar.Item>
                <Sidebar.Item
                  as={Link}
                  to="/dashboard?tab=My Plans"
                  active={tab === 'My Plans'}
                  icon={HiOutlineCalendar}
                  labelColor="dark"
                  className="rounded-md"
                >
                  My Plans
                </Sidebar.Item>
                <Sidebar.Item
                  as={Link}
                  to="/dashboard?tab=My Reviews"
                  active={tab === 'My Reviews'}
                  icon={HiOutlineChartBar}
                  labelColor="dark"
                  className="rounded-md"
                >
                  My Reviews
                </Sidebar.Item>
              </>
            )}
            {/* Admin Section */}
            {currentUser?.rest?.isAdmin && (
              <>
                <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Panel</div>
                <Sidebar.Item
                  as={Link}
                  to="/dashboard?tab=packages"
                  active={tab === 'packages'}
                  icon={HiOutlineCalendar}
                  labelColor="dark"
                  className="rounded-md"
                >
                  Packages
                </Sidebar.Item>
                <Sidebar.Item
                  as={Link}
                  to="/dashboard?tab=Booking Confirmations"
                  active={tab === 'Booking Confirmations'}
                  icon={HiDatabase}
                  labelColor="dark"
                  className="rounded-md"
                >
                  New Tours
                </Sidebar.Item>
                <Sidebar.Item
                  as={Link}
                  to="/dashboard?tab=Predefined Tours"
                  active={tab === 'Predefined Tours'}
                  icon={HiOutlineChartBar}
                  labelColor="dark"
                  className="rounded-md"
                >
                  Tours
                </Sidebar.Item>
                <Sidebar.Item
                  as={Link}
                  to="/dashboard?tab=Ai-tours"
                  active={tab === 'Ai-tours'}
                  icon={HiOutlineUserGroup}
                  labelColor="dark"
                  className="rounded-md"
                >
                  Plans
                </Sidebar.Item>
                <Sidebar.Item
                  as={Link}
                  to="/dashboard?tab=users"
                  active={tab === 'users'}
                  icon={HiOutlineUserGroup}
                  labelColor="dark"
                  className="rounded-md"
                >
                  Users
                </Sidebar.Item>
                <Sidebar.Item
                  as={Link}
                  to="/dashboard?tab=reviews"
                  active={tab === 'reviews'}
                  icon={HiOutlineCalendar}
                  labelColor="dark"
                  className="rounded-md"
                >
                  Reviews
                </Sidebar.Item>
            )}

{currentUser?.rest?.isAdmin && (
              <Sidebar.Item
                as={Link}
                to="/dashboard?tab=hire"
                active={tab === 'hire'}
                icon={HiDatabase}
                labelColor="dark"
              >
                Hire Details
              </Sidebar.Item>
            )}
            {currentUser?.rest?.isAdmin && (

            <Sidebar.Item
              as={Link}
              to="/dashboard?tab=vehicles"
              active={tab === 'vehicles'}
              icon={FaTaxi}
              labelColor="dark"
            >
              Vehicles
            </Sidebar.Item>
              </>
            )}
            {/* Divider */}
            <div className="my-4 border-t"></div>
            {/* Sign Out */}
            <Sidebar.Item
              icon={HiOutlineLogout}
              className="cursor-pointer text-red-600 hover:bg-red-50 rounded-md"
              onClick={handleSignout}
            >
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
