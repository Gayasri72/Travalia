import{BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Info from './pages/Info'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ContactUs from './pages/ContactUs'
import Header from './components/Header'
import Notfound from './pages/Notfound'
import Footer from './components/Footer'


export default function App() {
 

  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/info" element={<Info/>} />
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/contact" element={<ContactUs/>} />
        <Route path="*" element={<Notfound/>} />

      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}


