import { NavContext } from '../contexts/NavContext';

// hooks
import { useContext } from 'react';

export const useNavContext = () => {
  // context will be an object containing the state object and dispatch function
  const context = useContext(NavContext);

  // show error for any dev if this hook isn't used with the/an NavContextProvider, context will be empty if this is the case
  if (!context) {
    throw Error('useNavContext hook must be inside an NavContextProvider');
  }

  return context;
};
