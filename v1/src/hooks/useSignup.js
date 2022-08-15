import { projectAuth, projectFirestore, projectStorage } from '../firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { nanoid } from 'nanoid';
import { doc, setDoc } from 'firebase/firestore';

// hooks
import { useEffect, useState } from 'react';
import { useAuthContext } from './useAuthContext';

const uploadProfilePic = async (response, profPic) => {
  // define path to upload profPic to, use a unique and sanitised filename
  const uploadPath = `profpics/${response.user.uid}/${nanoid()}`;

  // create storage reference, 1st argument = storage to be used, 2nd = path
  const storageRef = ref(projectStorage, uploadPath);

  // upload file
  await uploadBytes(storageRef, profPic);

  // get url to uploaded pic
  return await getDownloadURL(storageRef);
};

// created user docs are used to show user other users and their status (on/offline)
const createUserDoc = async (response, displayName, imgUrl) => {
  // create user document with doc id of response.user.uid, will create 'users' collection if it doesn't already exist
  const docRef = doc(projectFirestore, 'users', response.user.uid);

  // define the user document's properties
  const newUser = {
    // make online: true by default, because user is logged in automatically when they sign up
    online: true,
    // because the displayName: value is displayName, we can just say displayName
    displayName,
    photoURL: imgUrl,
  };

  // create new user doc
  await setDoc(docRef, newUser);
};

export const useSignup = () => {
  // get dispatch function to update state object in AuthContext
  const { dispatch } = useAuthContext();

  // default values of null and false respectively
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  // used for cleanup
  const [isCancelled, setIsCancelled] = useState(false);

  const signup = async (email, password, displayName, profPic) => {
    // set error back to null, removes any error from previous attempts at signing up (otherwise a valid signup attempt will still show previous errors)
    setError(null);
    // used to show loading message to user, etc.
    setIsPending(true);

    try {
      // signup user, await will halt code until response is returned (i.e. once line of code is finished)
      // returned response object contains user object of user that was just signed up
      const response = await createUserWithEmailAndPassword(projectAuth, email, password);

      // show user error if response object is not returned for any reason
      if (!response) {
        throw new Error('Could not complete sign up! :( \nPlease try again later.');
      }

      // upload profile pic, return a url to uploaded pic
      const imgUrl = await uploadProfilePic(response, profPic);

      // add defined properties to user entry in firebase auth
      await updateProfile(response.user, { displayName: displayName, photoURL: imgUrl });

      // add user doc to users collection in firestore
      await createUserDoc(response, displayName, imgUrl);

      // dispatch login action. will fire the authReducer function in AuthContext.js, passing in the action object as an argument
      dispatch({ type: 'LOGIN', payload: response.user });

      // for cleanup, only update state objects if isCancelled is falsey
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (error) {
      // for cleanup, only update state objects if isCancelled is falsey
      if (!isCancelled) {
        console.log('error from useSignup hook: ', error);
        setError(error.message);
        setIsPending(false);
      }
    }
  };

  // cleanup function will fire if user navigates away from component, avoids "Warning: Can't perform a React state update on an unmounted component.""
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []); // empty dependency array, fire straight away and only once, won't be any reruns

  return { error, isPending, setError, signup };
};
