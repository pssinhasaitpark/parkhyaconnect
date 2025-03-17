import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from './authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  const loginUser = (credentials) => {
    dispatch(login(credentials));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    isAuthenticated,
    token,
    loginUser,
    logoutUser,
  };
};

export default useAuth;
