import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import useAuth from './useAuth';

const useCart = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();

  const {
    data: cartItems = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['my-cartItems', user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/carts?email=${user?.email}`);
      return data;
    },
  });

  return [cartItems, refetch, loading, isLoading];
};

export default useCart;
