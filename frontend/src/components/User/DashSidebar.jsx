import { Sidebar } from 'flowbite-react';
import {
  HiArrowSmRight,
  HiUser,
  HiOutlineGlobeAlt,
  HiOutlineCalendar,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();

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
          <Sidebar.ItemGroup>
            <Sidebar.Item
              as={Link}
              to="/dashboard?tab=profile"
              active={tab === 'profile'}
              icon={HiUser}
              label="User"
              labelColor="dark"
            >
              Profile
            </Sidebar.Item>
            <Sidebar.Item
              as={Link}
              to="/dashboard?tab=tour"
              active={tab === 'profile'}
              icon={HiOutlineGlobeAlt}
              labelColor="dark"
            >
              tour
            </Sidebar.Item>
            <Sidebar.Item
              as={Link}
              to="/dashboard?tab=booking"
              active={tab === 'profile'}
              icon={HiOutlineCalendar}
              labelColor="dark"
            >
              booking
            </Sidebar.Item>

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
