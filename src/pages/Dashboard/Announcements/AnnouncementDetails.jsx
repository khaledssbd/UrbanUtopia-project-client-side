import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

const AnnouncementDetails = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { id } = useParams();

  // fetch announcement on start like useEffect
  const { data: announcement = {}, isLoading } = useQuery({
    queryKey: ['announcement'],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/announcements/${id}?email=${user?.email}`
      );
      return data;
    },
  });

  const { title, description, date } = announcement || {};
  const dateToShow = new Date(date);

  const day = String(dateToShow.getDate()).padStart(2, '0');
  const month = String(dateToShow.getMonth() + 1).padStart(2, '0');
  const year = dateToShow.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-end mt-20">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="my-6 md:my-11">
      <Helmet>
        <title>GlamSpot | {title}</title>
      </Helmet>

      <div className="mx-0 md:mx-20 text-center animate__animated animate__backInUp">
        <h3 className="text-right text-sm font-normal">
          Posted on: {formattedDate}
        </h3>
        <h3 className="mt-5 font-play text-base text-justify md:text-xl font-bold">
          {title}
        </h3>
        <h3 className="mt-10 text-sm font-normal whitespace-pre-line text-justify ">
          Description: {description}
        </h3>
        {/* <div className="ml-10 sm:20 md:ml-40 space-y-3">
          <div className="text-left">
            <h3 className="text-sm font-normal whitespace-pre-line text-justify ">
              Description: {description}
            </h3>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AnnouncementDetails;
