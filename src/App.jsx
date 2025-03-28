import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Signup from './pages/auth/signup/Signup';
import Login from './pages/auth/login/Login';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import ResetPassword from './pages/auth/ResetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import PrivateRoutes from './components/routes/privateRoutes/PrivateRoutes.jsx';

const routes = [
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/dashboard", element: <Dashboard />, private: true },
];

const App = () => {
  return (
    <Routes>
      {routes.map(({ path, element, private: isPrivate }) => (
        isPrivate ? (
          <Route key={path} element={<PrivateRoutes />}>
            <Route path={path} element={element} />
          </Route>
        ) : (
          <Route key={path} path={path} element={element} />
        )
      ))}
    </Routes>
  );
};

export default App;