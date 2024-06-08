import { Navigate} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import PropTypes from 'prop-types';
import useRole from '../hooks/useRole';

// import Loading from '../components/AllLootie/Loading';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [role, isRoleLoading] = useRole();


  if (loading || isRoleLoading) {
    return (
      <div className="flex justify-center items-end mt-20">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  if (user && role === 'admin') return children;

  return <Navigate to="/dashboard" />;
};

export default AdminRoute;
AdminRoute.propTypes = {
  children: PropTypes.node,
};
