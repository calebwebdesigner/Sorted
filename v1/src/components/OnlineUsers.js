// hooks
import { useCollection } from '../hooks/useCollection';

// components
import Avatar from './Avatar';

// styles
import styles from './OnlineUsers.module.css';

export default function OnlineUsers() {
  const { documents, error } = useCollection('users');

  return (
    <div className={styles.userList}>
      <div className={styles.titleWrapper}>
        <h4>All Users</h4>
      </div>
      {error && <div className="err">{error}</div>}

      {/* once docs have been retrieved from collection */}
      {documents &&
        documents
          // sort alphabetically, letter a is less than letter z
          // if docA.displayName string is less than docB.displayName string, place docB after docA
          // if docA.displayName string is greater than docB.displayName string, place docB before docA
          // equal value nets no change
          .sort((docA, docB) => docA.displayName > docB.displayName)
          // then map over each item, rendering a div for each
          .map(user => (
            // keys are used to speed up the process of updating the dom to match the virtual dom
            // when the key changes, then the associated element will be re-rendered
            // if an element's key has not changed, then it won't be re-rendered when other elements with altered keys are (even if they have the same parent)
            // if no keys are used, then when a child element is altered, all of it's siblings will be updated too (even if they haven't changed)
            // more info here: https://www.youtube.com/watch?v=J_S97E8xjcA
            <div key={user.id} className={styles.userListItem}>
              <p>{user.displayName}</p>
              <Avatar src={user.photoURL} />
              {/* show whether user is online or not */}
              {!user.online && <span className={`${styles.userStatusDot} ${styles.userOffline}`}></span>}
              {user.online && <span className={`${styles.userStatusDot} ${styles.userOnline}`}></span>}
            </div>
          ))}
    </div>
  );
}
