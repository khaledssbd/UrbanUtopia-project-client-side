import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import Loading from '../components/AllLootie/Loading';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center pt-44 text-white">
        <Loading />
      </div>
    );
  }

  if (user) {
    return children;
  }

  return <Navigate state={{ from: location }} to="/login" replace></Navigate>;
};

export default PrivateRoute;

PrivateRoute.propTypes = {
  children: PropTypes.node,
};
