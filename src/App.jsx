import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./admin/AuthContext";
import { CartContextProvider } from "./store/CartContext";
import { UserProgressContextProvider } from "./store/UserProgressContext";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Header from "./components/Header";
import Meals from "./components/Meals";
import AdminHeader from "./admin/AdminHeader";
import ManageMeals from "./admin/ManageMeals";
import OrdersPage from "./admin/Order.jsx";

// ProtectedRoute component to protect admin routes
const ProtectedRoute = ({ element }) => {
  const { auth } = useAuth();
  return auth ? element : <Navigate to="/login" />;
};

// RedirectRoute component to redirect authenticated users away from certain routes
const RedirectRoute = ({ element, redirectTo }) => {
  const { auth } = useAuth();
  return auth ? <Navigate to={redirectTo} /> : element;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <UserProgressContextProvider>
          <CartContextProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Header />
                    <Meals />
                    <Cart />
                    <Checkout />
                  </>
                }
              />
              <Route path="/register" element={<Register />} />
              <Route
                path="/login"
                element={
                  <RedirectRoute element={<Login />} redirectTo="/admin" />
                }
              />
              <Route
                path="/order"
                element={
                  <ProtectedRoute
                    element={
                      <>
                        <AdminHeader />
                        <OrdersPage />
                      </>
                    }
                  />
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute
                    element={
                      <>
                        <AdminHeader />
                        <ManageMeals />
                      </>
                    }
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" />} />{" "}
              {/* Default route */}
            </Routes>
          </CartContextProvider>
        </UserProgressContextProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
