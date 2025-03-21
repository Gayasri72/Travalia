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
import Hires from './pages/Hires';
import Gallery from './pages/Gallery';



import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Tour from './pages/Tour';


export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="gap-2 m-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/info" element={<Info />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/contact" element={<ContactUs />} />

          <Route element={<PrivateRoute />}>
            <>
              <Route path="/dashboard" element={<Dashboard />} />
            </>
          </Route>
          <Route path="/tours" element={<Tours />} />
          <Route path="/tour/:id" element={<Tour/>}/>
          <Route path="/hires" element={<Hires />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}
