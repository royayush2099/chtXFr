import { useEffect } from 'react';
import {Toaster} from 'react-hot-toast';
import { Routes,Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SettingPage from './pages/SettingPage'
import { Loader } from 'lucide-react';
import { useAuthStore } from './store/useAuthStore';

import './App.css'


function App() {
 const {authUser,checkAuth,isCheckingAuth} = useAuthStore();
 useEffect(()=>{
     checkAuth()
 },[checkAuth]);
 console.log({authUser});
 if(isCheckingAuth && !authUser)
  return
 (
  <div className='flex items-center  justify-center h-screen'>
    <Loader className="size-10 animate-spin"/>
  </div>
 )

 

  return (
    <div>
   <Navbar/>
   <Routes>
   <Route path='/' element={authUser ? <HomePage/>: <Navigate to="/login"/>}/>//checkng if authUser then show them the homepage
   <Route path='/signup' element={!authUser ?<SignUpPage/>: <Navigate to={"/"}/>}/>
   <Route path='/login' element={!authUser ?<LoginPage/>: <Navigate to={"/"}/>}/>
   <Route path='/settings' element={<SettingPage/>}/>
   <Route path='/profile' element={authUser ?<ProfilePage/>: <Navigate to="/login"/>}/>
   </Routes>
   <Toaster/>
    </div>
  )
}

export default App
