import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Info from './pages/Info';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ContactUs from './pages/ContactUs';
import Header from './components/Header';
import Notfound from './pages/Notfound';
import Footer from './components/Footer';
import Tours from './pages/Tours';

import Gallery from './pages/Gallery';

import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/User/Dashboard';
import Tour from './pages/Tour';

//import TourBooking from './pages/Admin/TourBooking';
import AddPackages from './pages/Admin/AddPackages';
import Packages from './pages/Admin/Packages';

import CreatePackage from './pages/Ai/CreatePackage';
import EditePackges from './pages/Admin/EditePackges';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HireDetails from './pages/HireDetails';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen justify-between">
        <Header />
        <main className="flex-1 gap-2 m-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/info" element={<Info />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/contact" element={<ContactUs />} />

            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route element={<OnlyAdminPrivateRoute />}>
              <Route path="/" element={<Packages />} />
            </Route>

            <Route path="/tours" element={<Tours />} />
            <Route path="/tour/:id" element={<Tour />} />
            
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/create-package" element={<CreatePackage />} />

            <Route path="*" element={<Notfound />} />
            {/* <Route path="/admin/tourbooking" element={<TourBooking />} /> */}
            <Route path="/admin/addPackages" element={<AddPackages />} />
            <Route path="/admin/packages" element={<Packages />} />
            <Route path="/admin/packages/edit/:id" element={<EditePackges />} />



            <Route path="/hires" element={<HireDetails/>} />
          </Routes>
        </main>
        <Footer />

        <ToastContainer
          position="top-center"
          autoClose={2000}
          theme="colored"
          toastClassName="rounded-lg text-base font-semibold shadow-lg"
          bodyClassName="flex items-center"
        />
      </div>
    </BrowserRouter>
  );
}
