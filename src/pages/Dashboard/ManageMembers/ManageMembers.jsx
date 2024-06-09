import { Helmet } from 'react-helmet-async';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import deleteImg from '../../../assets/delete.svg';
import useAuth from '../../../hooks/useAuth';

const ManageMembers = () => {
  const axiosSecure = useAxiosSecure();
  const QueryClient = useQueryClient();
  const { user } = useAuth();

  // fetch data on start like useEffect
  const { data: allMembers = [], isLoading } = useQuery({
    queryKey: ['all-members'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/users/members?email=${user.email}`
      );
      return data;
    },
  });

  // delete a member
  const deleteMember = useMutation({
    mutationFn: async memberEmail => {
      const { data } = await axiosSecure.patch(
        `/users/member/${memberEmail}?email=${user?.email}`
      );
      return data;
    },
    onSuccess: () => {
      Swal.fire('Deleted!', 'The member has been deleted.', 'success');
      //  refetch();
      QueryClient.invalidateQueries({ queryKey: ['all-members'] });
    },
  });

  const handleDelete = member => {
    Swal.fire({
      title: 'Confirm to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async result => {
      if (result.isConfirmed) {
        const memberEmail = member.email;
        await deleteMember.mutateAsync(memberEmail);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-end mt-20">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="my-12">
      <Helmet>
        <title>UrbanUtopia | Manage Members</title>
      </Helmet>

      <h3 className="text-xl md:text-4xl text-center">
        Manage Members ({allMembers.length})
      </h3>

      <div>
        {allMembers.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-black mt-8">
            <table className="table table-zebra">
              {/* head starts here */}
              <thead className="bg-green-400">
                <tr>
                  <th className="text-sm text-black">Sl</th>
                  <th className="text-sm text-black">Name</th>
                  <th className="text-sm text-black">Email</th>
                  <th className="text-sm text-black">Member Since</th>
                  <th className="text-sm text-black">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {/* row starts here */}
                {allMembers?.map((member, i) => (
                  <tr key={member._id}>
                    <th>{i + 1}.</th>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{new Date(member.acceptDate).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleDelete(member)}>
                        <img
                          src={deleteImg}
                          alt="delete-item"
                          className="w-6"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <h3 className="mt-20 md:mt-40 text-4xl font-bold">No member yet</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMembers;
