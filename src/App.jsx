import React, { Children } from 'react'
import {BrowserRouter as Router,Route,Routes, Navigate,} from "react-router-dom";
import Home from './Pages/Home/Home';
import Order from './Pages/Order/Order';
import Cart from './Pages/Cart/Cart';
import Dashboard from './Pages/Admin/Dashboard/Dashboard';
import Nopage from './Pages/Nopage/Nopage';
import MyState from './Context/data/MyState';
import Login from './Pages/Registration/Login';
import Signup from './Pages/Registration/Signup';
import ProductInfo from './Pages/ProductInfo/ProductInfo';
import AddProduct from './Pages/Admin/Page/AddProduct';
import UpdateProduct from './Pages/Admin/Page/UpadateProduct';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AllProducts from './Pages/AllProducts/AllProducts';


function App() {
  return (
    <MyState>
      <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/order" element={
          <ProtectedRoute>
            <Order/>
          </ProtectedRoute>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login/>} />
        <Route path="/allproducts" element={<AllProducts/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/productinfo/:id" element={<ProductInfo />} />
        <Route path="/addproduct" element={
          <ProtectedRouteForAdmin>
            <AddProduct />
          </ProtectedRouteForAdmin>
        } />
        <Route path="/updateproduct" element={
          <ProtectedRouteForAdmin>
            <UpdateProduct />
          </ProtectedRouteForAdmin>
        } />
        <Route path="/*" element={<Nopage/>} />
      </Routes>
     <ToastContainer/>
    </Router>
    </MyState>
    
  )
}

export default App

// user
const ProtectedRoute = ({children})=>{
const user = localStorage.getItem('user')
if(user){
  return children
}else{
  return <Navigate to={'/login'}/>
}
}

// admin

const ProtectedRouteForAdmin = ({children}) =>{
  const admin = JSON.parse(localStorage.getItem('user'))

  if(admin.user.email === 'vivekrawat08wrk@gmail.com'){
    return children
  }
  else{
    return  <Navigate to={'/login'}/>
  }
}