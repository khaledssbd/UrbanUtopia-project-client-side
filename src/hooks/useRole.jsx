import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const token = localStorage.getItem('access-token');

  const { data: role = '', isLoading: isRoleLoading } = useQuery({
    queryKey: ['role', user?.email],
    enabled: !loading && !!user?.email && !!token,
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/user/role/${user?.email}?email=${user?.email}`
      );
      return data;
    },
  });
  return [role, isRoleLoading];
};

export default useRole;
