
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth } from "react-auth-kit";
import { AuthProvider } from "react-auth-kit";
import Userlogin from './Source/User/userlogin';
import SignUpPage from './Source/User/usersignup';
import UserInterface from './Source/User/UserInterface/userinterface';
import PromoInterface from './Source/User/Promotions/promo';
import ContactUs from './Source/User/ContactUs/contactus';
import AboutUs from './Source/User/AboutUs/aboutus'
import MyOrders from './Source/User/MyOrders/myorder';
import DashboardContent from './Source/Admin/dashboard';
import Customers from './Source/Admin/Userlist/customers';
import Products from './Source/Admin/ProductList/products';
import AddProducts from './Source/Admin/Additem/ProductAdd/Addproduct';
import Sales from './Source/Admin/Sales/Sales';
import EditItem from './Source/Admin/Editproduct/Editproduct';
import Orders from './Source/Admin/Orders/formorders';
import Stripe from './Source/User/stripe/StripeContainer'
import Cartpage from './Source/User/Cartpage';
import Form from './Source/User/payhere/Form'

function App() {
  return (
    <div className="App">
      
        <Router> 
          <Routes>
            <Route path="/" element={<Userlogin />} />
            <Route path="/signup" element={<SignUpPage />} />
            {/* <Route path="/userinterface" element={<UserInterface />} /> */}
            <Route path="/userinterface" element={<RequireAuth loginPath="/">
              <UserInterface/>
            </RequireAuth>} />
            <Route path="/promointerface" element={<PromoInterface />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/myorders" element={<MyOrders/>}/>
            <Route path="/dashboard" element={<DashboardContent />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/additem" element={<AddProducts />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/products/edit/:id?" element={<EditItem />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/payment" element={<Stripe/>} />
            <Route path="/formpayment" element={<Form/>} />
            <Route path="/cartpage" element={<Cartpage/>} />
          </Routes>
        </Router>
      
    </div>
  );
}

export default App;