// hooks
import { useEffect, useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavContext } from '../../hooks/useNavContext';

// components
import ProjectList from './ProjectList';
import ProjectFilter from './ProjectFilter';

export default function Dashboard() {
  const { documents, error } = useCollection('projects');
  const { user } = useAuthContext();

  // used to filter which projects are shown
  const [currentFilter, setCurrentFilter] = useState('assigned to me');

  // set filter to what user chose in ProjectFilter.js
  const changeFilter = newFilter => {
    setCurrentFilter(newFilter);
  };

  // get dispatch function from NavContext
  const { dispatch } = useNavContext();
  // define pageTitle to be used on page and passed into NavContext
  const localPageTitle = 'Dashboard';

  // dispatch is inside useEffect with an empty dependency array so it only runs once, otherwise it'll cause an infinite loop
  useEffect(() => {
    // dispatch will run navReducer, and the state object as it is currenty will be passed in, along with the action object defined here "{ type: 'PAGE_LOADED', payload: pageTitle }", the switch function will run case "'PAGE_LOADED'" and update the state object with the defined changes, thereby causing any components using that state object (in this case the navbar) to be re-rendered with the new state object
    dispatch({ type: 'PAGE_LOADED', payload: localPageTitle });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty dependency array will cause useEffect to fire once when the component is rendered

  // show only filtered projects on dashboard
  // only run function if "documents" is filled, i.e. if "const { documents, error } = useCollection('projects');" has returned a value (will take a sec), return null otherwise
  const projects = documents
    ? documents.filter(doc => {
        // if true is returned, item is kept in array, false will have the item removed
        switch (currentFilter) {
          case 'assigned to me':
            let assignedToMe = false;
            doc.assignedUsersList.forEach(assignedUser => {
              // if user id of user that's logged in = one of the ids on the assignedUsersList
              if (user.uid === assignedUser.id) {
                assignedToMe = true;
              }
            });
            return assignedToMe;

          // all five of these categories have the same code block to run if the case matches, so they can be stacked like this
          case 'design':
          case 'development':
          case 'marketing':
          case 'sales':
            // if category = the category to filter by that the user clicked, return true
            return doc.category === currentFilter;

          case 'all':
          default:
            return true;
        }
      })
    : null;

  return (
    <div>
      {error && <p className="err">{error}</p>}
      {documents && <ProjectFilter currentFilter={currentFilter} changeFilter={changeFilter} />}
      {projects && <ProjectList projects={projects} currentFilter={currentFilter} />}
    </div>
  );
}
