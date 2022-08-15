// this context is used to keep the state object within this file matching what the authentication state of the user is in firebase auth
// used to know if user is logged in or not already, so if they refresh the site it won't ask them to log in again

import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useReducer } from 'react';
import { projectAuth } from '../firebase/config';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    // return current state, with the user property changed to action.payload
    case 'LOGIN':
      return { ...state, user: action.payload };

    // as there's no user logged in, turning user into null suffices
    case 'LOGOUT':
      return { ...state, user: null };

    case 'AUTH_IS_READY':
      return { user: action.payload, authIsReady: true };

    // keep state as it is, make no changes, if no cases run
    default:
      return state;
  }
};

// children are any components this provider component wraps
export const AuthContextProvider = ({ children }) => {
  // authReducer is responsible for updating the state
  const [state, dispatch] = useReducer(
    authReducer,
    // this is the "state" object
    {
      user: null,
      // used to know if user is already logged in on firebase auth
      authIsReady: false,
    }
  );

  // find out whether user is already logged in or not
  // used to keep state of AuthContext matching what the authentication state of the user is in firebase, needs to only be run once, pretty much just in case user refreshes or navigates away from the site for a moment
  useEffect(() => {
    // communicate with firebase and let us know when there's a change of authentication status, and when there is, fire this function. will return a function to remove the listener that's being set by using onAuthStateChanged, fill unsub with that function. the user object is being passed in.
    const unsub = onAuthStateChanged(projectAuth, user => {
      // dispatch will run authReducer, and the current state (this state: const [state,) will be passed in, along with the action object defined here "{ type: 'AUTH_IS_READY', payload: user }", the switch function will run case "'AUTH_IS_READY'" and return the state as it is, but with the user and authIsReady values changed to: the payload defined here "payload: user", and "authIsReady: true"
      dispatch({ type: 'AUTH_IS_READY', payload: user });

      // make sure this function only fires once, unsub() will remove the listener
      unsub();
    });
  }, []); // empty dependency array will cause useEffect to fire once when the component is rendered

  console.log('AuthContext state: ', state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {/* children represent whatever components the context wraps */}
      {/* all children have access to the state object, and dispatch function (which is used to change props within the state object) */}
      {/* children components will access the state object and dispatch function through the useAuthContext hook */}
      {children}
    </AuthContext.Provider>
  );
};
