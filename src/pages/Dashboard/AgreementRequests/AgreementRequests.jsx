import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { Helmet } from 'react-helmet-async';
import { Typewriter } from 'react-simple-typewriter';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { AiOutlineLike } from 'react-icons/ai';
import { BiDislike } from 'react-icons/bi';

// for export pdf
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import useAuth from '../../../hooks/useAuth';

const AgreementRequests = () => {
  const { user } = useAuth();
  const doc = new jsPDF();
  const axiosSecure = useAxiosSecure();

  // fetch agreements on start like useEffect
  const {
    data: agreements = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['agreements'],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/agreements?email=${user?.email}`
      );
      return data;
    },
  });

  const handleExportPDF = () => {
    doc.autoTable({
      html: '#manageAgreements',
      bodyStyles: { fillColor: 'yellow' },
    });
    doc.save('agreements.pdf');
  };

  const handleAcceptAgreement = async agreement => {
    if (agreement.status === 'checked') {
      return toast.error('Already checked');
    }

    const document = {
      acceptDate: new Date(),
      apartment: agreement?.apartment,
    };

    const { data } = await axiosSecure.patch(
      `/agreements/accept/${agreement._id}?email=${user?.email}`,
      document
    );
    if (data.modifiedCount > 0) {
      toast.success('Agreement saved successfully');
      refetch();
    }
  };

  const handleRejectAgreement = async (agreementId, agreementStatus) => {
    if (agreementStatus === 'checked') {
      return toast.error('Already checked!');
    }

    const { data } = await axiosSecure.patch(
      `/agreements/reject/${agreementId}?email=${user?.email}`
    );
    if (data.modifiedCount > 0) {
      toast.success('Agreement saved successfully');
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-end mt-20">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="my-10 sm:px-6">
      <Helmet>
        <title>UrbanUtopia | Manage Agreements</title>
      </Helmet>

      <div className="text-center">
        <span
          style={{ color: '#fa237d', fontWeight: 'bold', fontSize: '25px' }}
        >
          <Typewriter
            words={['Manage Agreements']}
            loop={550}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </span>
      </div>
      <div className="text-end">
        <button
          className="btn bg-green-400 text-white"
          onClick={handleExportPDF}
        >
          Export PDF
        </button>
      </div>

      {agreements.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-black mt-8">
          <table className="table table-zebra" id="manageAgreements">
            {/* head starts here */}
            <thead className="bg-green-400">
              <tr>
                <th className="text-sm text-black">Sl</th>
                <th className="text-sm text-black">Name</th>
                <th className="text-sm text-black">Email</th>
                <th className="text-sm text-black">Apartment</th>
                <th className="text-sm text-black">Floor</th>
                <th className="text-sm text-black">Block</th>
                <th className="text-sm text-black">Rooms</th>
                <th className="text-sm text-black">Rent</th>
                <th className="text-sm text-black">Status</th>
                <th className="text-sm text-black">Request Date</th>
                <th className="text-sm text-black">Accept</th>
                <th className="text-sm text-black">Reject</th>
              </tr>
            </thead>
            <tbody>
              {/* row starts here */}
              {agreements?.map((agreement, i) => (
                <tr key={agreement._id}>
                  <th>{i + 1}.</th>
                  <td>{agreement?.lesseeName}</td>
                  <td>{agreement?.lesseeEmail}</td>
                  <td>{agreement?.apartment}</td>
                  <td>{agreement?.floor}</td>
                  <td>{agreement?.block?.toUpperCase()}</td>
                  <td>{agreement?.room}</td>
                  <td>${agreement?.rent}</td>
                  <td
                    className={`inline-flex capitalize items-center mt-2 px-3 py-1 rounded-full gap-x-2 ${
                      agreement.status === 'pending' &&
                      'bg-yellow-100/90 text-yellow-600'
                    } ${
                      agreement.status === 'checked' &&
                      'bg-orange-100/90 text-emerald-600'
                    }`}
                  >
                    {agreement.status}
                  </td>

                  <td>
                    {new Date(agreement.requestDate).toLocaleDateString('gmt')}
                  </td>
                  <td>
                    <button onClick={() => handleAcceptAgreement(agreement)}>
                      <AiOutlineLike className="text-2xl" />
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        handleRejectAgreement(agreement._id, agreement.status)
                      }
                    >
                      <BiDislike className="text-2xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h3 className="mt-20 text-xl font-bold text-center">
          No agreement yet
        </h3>
      )}
    </div>
  );
};

export default AgreementRequests;
