// this context is used to provide the page title of the current page to the navbar component, so it can be shown next to the logout button

import { createContext, useReducer } from 'react';

// used to keep state of NavContext matching what the authentication state of the user is in firebase auth
export const NavContext = createContext();

export const navReducer = (state, action) => {
  switch (action.type) {
    // once page is loaded, then the title in the nav bar can be updated, if done beforehand then it'll error out due to an "undefined" variable
    case 'PAGE_LOADED':
      return { pageTitle: action.payload };

    // keep state as it is, make no changes, if no cases match
    default:
      return state;
  }
};

// children are any components this provider component wraps
export const NavContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    // the navReducer function is responsible for updating the state
    navReducer,
    // this is the "state" object
    { pageTitle: null }
  );

  console.log('NavContext state: ', state);

  return (
    <NavContext.Provider value={{ ...state, dispatch }}>
      {/* children represent whatever components the context wraps */}
      {/* all children have access to the state object, and dispatch function (which is used to change props within the state object) */}
      {/* children components will access the state object and dispatch function through the useNavContext hook */}
      {children}
    </NavContext.Provider>
  );
};
