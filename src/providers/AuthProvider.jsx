import { createContext, useEffect, useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  FacebookAuthProvider,
  sendEmailVerification,
} from 'firebase/auth';
import app from '../firebase/firebase.config';
import PropTypes from 'prop-types';
import useAxiosPublic from '../hooks/useAxiosPublic';

const auth = getAuth(app);

export const AuthContext = createContext(null);

// social auth providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const verifyUser = unverifiedUser => {
    setLoading(true);
    return sendEmailVerification(unverifiedUser);
  };

  const logIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const signInWithSocial = socialProvider => {
    setLoading(true);
    return signInWithPopup(auth, socialProvider);
  };

  const updateUserProfile = (userName, userPhotoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: userName,
      photoURL: userPhotoURL,
    });
  };

  const getPassWordResetMail = email => {
    return sendPasswordResetEmail(auth, email);
  };

  const getToken = async email => {
    const { data } = await axiosPublic.post('/getJwtToken', email);
    localStorage.setItem('access-token', data.token);
    setLoading(false);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, currentUser => {
      const userEmail = currentUser?.email || user?.email;
      const objectEmail = { email: userEmail };
      setUser(currentUser);
      
      // if user exists then issue a token
      if (currentUser) {
        getToken(objectEmail);
        setLoading(false);
      } else {
        localStorage.removeItem('access-token');
        setLoading(false);
      }
    });
    return () => unSubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    setLoading,
    createUser,
    verifyUser,
    logIn,
    logOut,
    signInWithSocial,
    googleProvider,
    facebookProvider,
    updateUserProfile,
    getPassWordResetMail,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.node,
};
