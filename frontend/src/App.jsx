import{BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from '../pages/Home'
import Info from '../pages/Info'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import ContactUs from '../pages/ContactUs'
import Header from '../components/Header'


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

      </Routes>
    </BrowserRouter>
  )
}


