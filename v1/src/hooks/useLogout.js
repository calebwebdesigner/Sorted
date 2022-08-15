import { projectAuth, projectFirestore } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

// hooks
import { useEffect, useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
  // get dispatch function to update state object in AuthContext, and user object
  const { dispatch, user } = useAuthContext();

  // default values of null and false respectively
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  // used for cleanup
  const [isCancelled, setIsCancelled] = useState(false);

  const logout = async () => {
    setError(null);
    setIsPending(true);

    try {
      // update online status to false before signing the user out, if the user is already signed out, access will be denied
      const { uid } = user;
      const docRef = doc(projectFirestore, 'users', uid);
      await updateDoc(docRef, { online: false });

      // sign user out
      await signOut(projectAuth);

      // dispatch logout action, no payload needed as we want the user to become null, which it will be as defined in AuthContext.js
      dispatch({ type: 'LOGOUT' });

      // make sure "logout" is shown on logout button instead of "logging out..." if user logs back in, this bug sometimes happens if user logs out, then back in without refreshing the page
      setIsPending(false);

      // if is here for cleanup, will only allow the state objects to be updated if isCancelled is false
      if (!isCancelled) {
        setIsPending(false);

        // return error state to default, in case there was an error
        setError(null);
      }
    } catch (error) {
      // if is here for cleanup, will only allow the state objects to be updated if isCancelled is false
      if (!isCancelled) {
        console.log('logout function from useLogout hook error: ', error);
        setError(error.message);
        setIsPending(false);
      }
    }
  };

  // cleanup function which will fire if user navigates away from component, avoids this: Warning: Can't perform a React state update on an unmounted component.
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []); // empty dependency array, fire straight away and only once, won't be any reruns

  return { error, isPending, logout };
};
