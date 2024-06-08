import { createBrowserRouter } from 'react-router-dom';
import Main from '../Layout/Main';
import Home from '../pages/Home/Home/Home';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import Dashboard from '../Layout/Dashboard';
import PrivateRoute from './PrivateRoute';
import ManageMembers from '../pages/Dashboard/ManageMembers/ManageMembers';
import AdminRoute from './AdminRoute';
import UserProfile from '../pages/Dashboard/All Profile/UserProfile';
import UpdateProfile from '../pages/UpdateProfile/UpdateProfile';
import MakePayment from '../pages/Dashboard/Payment/MakePayment';
import PaymentHistory from '../pages/Dashboard/Payment/PaymentHistory/PaymentHistory';
import DashboardHome from '../pages/Dashboard/DashboardHome/DashboardHome';
import UserRoute from './UserRoute';
import MakeAnnouncement from '../pages/Dashboard/Announcements/MakeAnnouncement';
import ManageAnnouncements from '../pages/Dashboard/Announcements/ManageAnnouncements';
import AnnouncementDetails from '../pages/Dashboard/Announcements/AnnouncementDetails';
import AllApartments from '../pages/Apartments/AllApartments';
import AddAppartment from '../pages/Apartments/AddApartment';
import ManageApartments from '../pages/Apartments/ManageApartments';
import Announcements from '../pages/Dashboard/Announcements/Announcements';
import AgreementRequests from '../pages/Dashboard/AgreementRequests/AgreementRequests';
import AdminProfile from '../pages/Dashboard/All Profile/AdminProfile';
import MemberProfile from '../pages/Dashboard/All Profile/MemberProfile';
import MemberRoute from './MemberRoute';
import PaymentPage from '../pages/Dashboard/Payment/PaymentPage';
import ManageCoupons from '../pages/Home/Coupons/ManageCoupons';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'all-apartments',
        element: <AllApartments />,
      },
      {
        path: 'update-profile',
        element: (
          <PrivateRoute>
            <UpdateProfile />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: 'dashboard',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <DashboardHome />
          </PrivateRoute>
        ),
      },
      {
        path: 'announcements',
        element: (
          <PrivateRoute>
            <Announcements />
          </PrivateRoute>
        ),
      },
      {
        path: 'announcement/:id',
        element: (
          <PrivateRoute>
            <AnnouncementDetails />
          </PrivateRoute>
        ),
      },
      // user routes
      {
        path: 'user-profile',
        element: (
          <PrivateRoute>
            <UserRoute>
              <UserProfile />
            </UserRoute>
          </PrivateRoute>
        ),
      },

      // member routes
      {
        path: 'member-profile',
        element: (
          <PrivateRoute>
            <MemberRoute>
              <MemberProfile />
            </MemberRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'make-payment',
        element: (
          <PrivateRoute>
            <MemberRoute>
              <MakePayment />
            </MemberRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'payment-page',
        element: (
          <PrivateRoute>
            <MemberRoute>
              <PaymentPage />
            </MemberRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'payment-history',
        element: (
          <PrivateRoute>
            <MemberRoute>
              <PaymentHistory />
            </MemberRoute>
          </PrivateRoute>
        ),
      },

      // admin routes
      {
        path: 'admin-profile',
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'manage-members',
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ManageMembers />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'agreement-requests',
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AgreementRequests />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'make-announcement',
        element: (
          <PrivateRoute>
            <AdminRoute>
              <MakeAnnouncement />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'manage-announcements',
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ManageAnnouncements />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'add-apartment',
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AddAppartment />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'manage-apartments',
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ManageApartments />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: 'manage-coupons',
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ManageCoupons />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
