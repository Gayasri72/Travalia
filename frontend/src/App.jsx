import{BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from '../pages/Home'
import Info from '../pages/Info'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'


function App() {
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/info" element={<Info/>} />
        <Route path="/sign-in" element={<SignIn/>} />
        <Route path="/sign-up" element={<SignUp/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
