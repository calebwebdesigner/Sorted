import { NavLink } from 'react-router-dom';

// hooks
import { useAuthContext } from '../hooks/useAuthContext';

// components
import Avatar from './Avatar';

// styles
import styles from './Sidebar.module.css';

// images
import DashboardIcon from '../assets/dash.svg';
import AddIcon from '../assets/add.svg';
import InstaIcon from '../assets/insta.svg';
import GithubIcon from '../assets/github.svg';

export default function Sidebar() {
  const { user } = useAuthContext();

  return (
    <div className={styles.sidebar}>
      <div className={styles.content}>
        <div>
          {/* user display */}
          <div className={styles.userDisplay}>
            <Avatar src={user.photoURL} />
            <p className={`subtxt-light ${styles.userSubText}`}>logged in as</p>
            <h4>{user.displayName}</h4>
          </div>

          {/* links */}
          <nav className={styles.links}>
            <ul>
              <li>
                {/* NavLink will give an "active" class to itself when the url path matches "to" */}
                <NavLink exact to="/">
                  <img src={DashboardIcon} alt="dashboard icon" />
                  <p>Dashboard</p>
                </NavLink>
                <NavLink to="/create">
                  <img src={AddIcon} alt="add project icon" />
                  <p>Create New Project</p>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        {/* footer */}
        <div>
          <div className={styles.socials}>
            {/* use rel="noreferrer" to stop older browser windows getting potentially hijacked */}
            <a href="https://www.instagram.com/calebwebdesigner" target="_blank" rel="noreferrer">
              <img class="insta" src={InstaIcon} alt="Instagram: @calebwebdesigner" />
            </a>
            <a href="https://github.com/calebwebdesigner" target="_blank" rel="noreferrer">
              <img class="github" src={GithubIcon} alt="Github: calebwebdesigner" />
            </a>
          </div>
          <div className={styles.socialsText}>
            <p className="subtxt-light">© Copyright 2022,&nbsp;</p>
            <a href="https://calebwebdesigner.dev" target="_blank" rel="noreferrer">
              <p className="subtxt-light">calebwebdesigner</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
