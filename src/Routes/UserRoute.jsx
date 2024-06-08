import { Navigate} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import PropTypes from 'prop-types';
import useRole from '../hooks/useRole';

// import Loading from '../components/AllLootie/Loading';

const UserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [role, isRoleLoading] = useRole();


  if (loading || isRoleLoading) {
    return (
      <div className="flex justify-center items-end mt-20">
        <span className="loading loading-dots loading-lg"></span>
      </div>
      //  <div className="flex justify-center items-center pt-44">
      //    <Loading />
      //  </div>
    );
  }

  if (user && role === 'user') {
    return children;
  }

  return <Navigate to='/dashboard'/>
};

export default UserRoute;
UserRoute.propTypes = {
  children: PropTypes.node,
};
