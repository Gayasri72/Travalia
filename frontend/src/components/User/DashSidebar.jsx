import { Sidebar } from 'flowbite-react';
import {
  HiArrowSmRight,
  HiUser,
  HiGift,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiDatabase,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

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
      <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col gap-1">
            <Sidebar.Item
              as={Link}
              to="/dashboard?tab=profile"
              active={tab === 'profile'}
              icon={HiUser}
              label={currentUser?.rest?.isAdmin ? 'Admin' : 'User'}
              labelColor="dark"
            >
              Profile
            </Sidebar.Item>
            {currentUser?.rest?.isAdmin && (
              <Sidebar.Item
                as={Link}
                to="/dashboard?tab=packages"
                active={tab === 'packages'}
                icon={HiOutlineCalendar}
                labelColor="dark"
              >
                Packages
              </Sidebar.Item>
            )}
            {!currentUser?.rest?.isAdmin && (
              <Sidebar.Item
                as={Link}
                to="/dashboard?tab=My Bookings"
                active={tab === 'My Bookings'}
                icon={HiGift}
                labelColor="dark"
              >
                My Bookings
              </Sidebar.Item>
            )}


            {!currentUser?.rest?.isAdmin && (
              <Sidebar.Item
                as={Link}
                to="/dashboard?tab=My Plans"
                active={tab === 'My Plans'}
                icon={HiGift }
                labelColor="dark"
              >
                My Plans
              </Sidebar.Item>
              
            )}
            {!currentUser?.rest?.isAdmin && (
              <Sidebar.Item
                as={Link}
                to="/dashboard?tab=My Reviews"
                active={tab === 'My Reviews'}
                icon={HiGift }
                labelColor="dark"
              >
                My Reviews
              </Sidebar.Item>
              
            )}
             {currentUser?.rest?.isAdmin && (

              <Sidebar.Item
                as={Link}
                to="/dashboard?tab=Booking Confirmations"
                active={tab === 'Booking Confirmations'}
                icon={HiDatabase}
                labelColor="dark"
              >
                Booking Status
              </Sidebar.Item>
            )}
            {currentUser?.rest?.isAdmin && (
              <Sidebar.Item
                as={Link}
                to="/dashboard?tab=Predefined Tours"
                active={tab === 'Predefined Tours'}
                icon={HiOutlineChartBar}
                labelColor="dark"
              >
                Predefined Tours
              </Sidebar.Item>
            )}
             {currentUser?.rest?.isAdmin && (
              <Sidebar.Item
                as={Link}
                to="/dashboard?tab=Ai-tours"
                active={tab === 'Ai-tours'}
                icon={HiOutlineUserGroup}
                labelColor="dark"
              >
                User Defined Tours
              </Sidebar.Item>
            )}
            {currentUser?.rest?.isAdmin && (
              <Sidebar.Item
                as={Link}
                to="/dashboard?tab=users"
                active={tab === 'users'}
                icon={HiOutlineUserGroup}
                labelColor="dark"
              >
                Users
              </Sidebar.Item>
            )}
             {currentUser?.rest?.isAdmin && (
              <Sidebar.Item
                as={Link}
                to="/dashboard?tab=reviews"
                active={tab === 'reviews'}
                icon={HiOutlineCalendar}
                labelColor="dark"
              >
                Reviews
              </Sidebar.Item>
            )}

            <Sidebar.Item
              icon={HiArrowSmRight}
              className="cursor-pointer"
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
