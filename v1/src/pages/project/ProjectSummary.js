import { niceifyDate } from '../../custom/customFunctions';

// hooks
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import { useNavContext } from '../../hooks/useNavContext';

// components
import Avatar from '../../components/Avatar';

// styles
import styles from './ProjectSummary.module.css';

export default function ProjectSummary({ project }) {
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { removeDocument } = useFirestore('projects');

  const handleClickShowModal = () => {
    if (showModal) {
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  };

  const handleClickConfirmDelete = () => {
    removeDocument(project.id);
    navigate('/');
  };

  // get dispatch function from NavContext
  const { dispatch } = useNavContext();
  // define pageTitle to be used on page and passed into NavContext
  const localPageTitle = 'Project View';

  // dispatch is inside useEffect with an empty dependency array so it only runs once, otherwise it'll cause an infinite loop
  useEffect(() => {
    // dispatch will run navReducer, and the state object as it is currenty will be passed in, along with the action object defined here "{ type: 'PAGE_LOADED', payload: pageTitle }", the switch function will run case "'PAGE_LOADED'" and update the state object with the defined changes, thereby causing any components using that state object (in this case the navbar) to be re-rendered with the new state object
    dispatch({ type: 'PAGE_LOADED', payload: localPageTitle });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty dependency array will cause useEffect to fire once when the component is rendered

  return (
    <>
      <div className={styles.projectSummarySection}>
        <div className={styles.projectSummary}>
          <h2>{project.name}</h2>
          <p className={`subtxt-dark ${styles.dueDate}`}>Due: {niceifyDate(project.dueDate.toDate())}</p>
          <p className="subtxt-dark">Created By: {project.createdBy.displayName}</p>
          <p className={styles.details}>{project.details}</p>
          <p className={styles.assignedTo}>Assigned to:</p>
          <div className={styles.assignedUsers}>
            {project.assignedUsersList
              // sort alphabetically, letter a is less than letter z
              // if docA.displayName string is less than docB.displayName string, place docB after docA
              // if docA.displayName string is greater than docB.displayName string, place docB before docA
              // equal value nets no change
              .sort((docA, docB) => docA.displayName > docB.displayName)
              .map(user => (
                <div key={user.id}>
                  <Avatar src={user.photoURL} />
                </div>
              ))}
          </div>
        </div>
        {/* <button className="btn">Mark as Complete</button> */}
        {/* if logged in user's id = the is of the user that created the project */}
        {user.uid === project.createdBy.id && (
          <div className="center-button-wrapper">
            <button className={`btn ${styles.deleteButton}`} onClick={handleClickShowModal}>
              Delete Project
            </button>
          </div>
        )}
      </div>

      {/* confirm delete popup modal */}
      {showModal && (
        <div className={styles.modalBg}>
          <div className={styles.modalBox}>
            <p>Are you sure you want to delete this project?</p>
            <p>
              (this is <span>IRREVERSIBLE</span>!)
            </p>
            <div className={styles.modalButtonWrapper}>
              <button className="btn" onClick={handleClickConfirmDelete}>
                Confirm
              </button>
              <button className="btn" onClick={handleClickShowModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
