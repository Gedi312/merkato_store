import Header from "./components/Header";
import "./App.css";
import ProductPage from "./page/ProductPage";
import ProductDetail from "./page/ProductDetail";
import CustomerProfile from "./page/CustomerProfile";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OrderTracking from './page/OrderTracking'
import ShopingCart from './page/ShopingCart'
import Checkout from './page/Checkout'
import Login from './page/Login'
import Signup from './page/Signup'
import RequireAuth from './components/RequireAuth'

import AdminLayout from './page/admin/AdminLayout'
import Dashboard from './page/admin/Dashboard'
import ProductManagement from './page/admin/ProductManagement'
import CategoryManagement from './page/admin/CategoryManagement'

function App() {

  return (
    <div>
      <Header />
      <div className="pt-[4.5rem]">
        <Routes>
          <Route path="/" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/OrderTracking" element={<OrderTracking />} />
          <Route path="/ShopingCart" element={<ShopingCart />} />
          <Route path="/CheckOut" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/admin" element={<RequireAuth allowedRoles={['admin']}><AdminLayout/></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
          </Route>
        </Routes>
      </div>
    </div>
  );


}

export default App;
