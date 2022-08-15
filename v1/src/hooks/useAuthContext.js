import { AuthContext } from '../contexts/AuthContext';

// hooks
import { useContext } from 'react';

export const useAuthContext = () => {
  // context will be an object containing the state object and dispatch function
  const context = useContext(AuthContext);

  // show error for any dev if this hook isn't used with the/an AuthContextProvider, context will be empty if this is the case
  if (!context) {
    throw Error('useAuthContext hook must be inside an AuthContextProvider');
  }

  return context;
};
