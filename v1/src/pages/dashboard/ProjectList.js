import { Link } from 'react-router-dom';
import { niceifyDate } from '../../custom/customFunctions';

// components
import Avatar from '../../components/Avatar';

// styles
import styles from './ProjectList.module.css';

export default function ProjectList({ projects, currentFilter }) {
  // give user specific messages when using a filter that shows no results
  const setErrorMessage = () => {
    if (currentFilter === 'assigned to me' && projects.length === 0) {
      return 'You currently have no projects assigned to you!';
    } else if (projects.length === 0) {
      return 'There are no projects within this category to display!';
    }
  };
  const errorMessage = setErrorMessage();

  return (
    <div className={styles.projectList}>
      {errorMessage && <p>{errorMessage}</p>}
      {projects

        // sort alphabetically, letter a is less than letter z
        // if docA.name string is less than docB.name string, place docB after docA
        // if docA.name string is greater than docB.name string, place docB before docA
        // equal value nets no change
        .sort((docA, docB) => docA.name > docB.name)

        // projects.map will only show anything if there's something to show, no error will pop up if projects is empty
        .map(project => (
          // use Link instead of <a>, Link will cause react to "catch" the request and render it appropriately in the user's browser, nothing gets sent to the server, meaning the page also won't flash/reload
          <Link key={project.id} to={`/project/${project.id}`}>
            {/* name */}
            <p>{project.name}</p>

            {/* due date */}
            <p className="subtxt-dark">Due: {niceifyDate(project.dueDate.toDate())}</p>

            {/* assigned user avatars */}
            <div className={styles.assignedTo}>
              <ul>
                {project.assignedUsersList
                  .sort((docA, docB) => docA.displayName > docB.displayName)
                  .map(user => (
                    <li key={user.id}>
                      <Avatar src={user.photoURL} />
                    </li>
                  ))}
              </ul>
            </div>
          </Link>
        ))}
    </div>
  );
}
