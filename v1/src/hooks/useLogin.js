import { signInWithEmailAndPassword } from 'firebase/auth';
import { projectAuth } from '../firebase/config';

// hooks
import { useEffect, useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useFirestore } from './useFirestore';

export const useLogin = () => {
  // get dispatch function to update state object in AuthContext
  const { dispatch } = useAuthContext();

  // get updateDoc function and rsponse object
  const { updateDocument } = useFirestore('users');

  // default values of null and false respectively
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  // used for cleanup
  const [isCancelled, setIsCancelled] = useState(false);

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    // sign user in
    try {
      // logging in a user will return a "response" object
      const response = await signInWithEmailAndPassword(projectAuth, email, password);

      // update online status to true after the user signs in, access will be denied if we do this earlier
      await updateDocument(response.user.uid, { online: true });

      // dispatch login action. will fire the authReducer function in AuthContext.js, passing in the action object as an argument
      dispatch({ type: 'LOGIN', payload: response.user });

      // here for cleanup, only allows state objects to be updated if isCancelled is false
      if (!isCancelled) {
        setIsPending(false);
        // return error state to default, in case there was an error
        setError(null);
      }
    } catch (error) {
      // here for cleanup, only allows state objects to be updated if isCancelled is false
      if (!isCancelled) {
        console.log('login function from useLogin hook error: ', error);
        setError(error.message);
        setIsPending(false);
      }
    }
  };

  // cleanup function fires if user navigates away from component, avoids: "Warning: Can't perform a React state update on an unmounted component."
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []); // empty dependency array, function will fire straight away and only once, won't be any reruns

  return { error, isPending, login };
};
