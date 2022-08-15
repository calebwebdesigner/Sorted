import { Link, useLocation } from 'react-router-dom';

// hooks
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavContext } from '../hooks/useNavContext';

// styles
import styles from './Navbar.module.css';

// images
import Logo from '../assets/logo.svg';

export default function Navbar() {
  const { isPending, logout } = useLogout();
  const { user } = useAuthContext();
  const { pageTitle } = useNavContext();

  // get current page, and on url change, check if user is on login/signup page, if so then show the associated button as active
  const currentPage = useLocation().pathname;

  return (
    <div className={styles.navbar}>
      <ul>
        <li className={styles.logo}>
          <img src={Logo} alt="sorted logo" />
          <span>Sorted.</span>
        </li>

        <div>
          {/* pageTitle only loads once the page has loaded */}
          {user && (
            <li className={styles.pageTitle}>
              <h4>{pageTitle}</h4>
            </li>
          )}

          {/* only show login/signup buttons if user isn't logged in */}
          {!user && (
            // need fragment as jsx expressions can only have one parent element
            <>
              <li>
                {/* as Link is from react-router, this Navbar component will need to be rendered within the bounds of Browserouter, i.e. it needs to be a child of <BrowserRouter>, and it is, in App.js  */}
                <Link to="/login">
                  {/* show either login or signup button as active if user is on the associated page */}
                  {currentPage === '/login' && <button className={`${styles.navbarButtonActive} btn`}>Login</button>}
                  {currentPage !== '/login' && <button className="btn">Login</button>}
                </Link>
                <Link to="/signup">
                  {currentPage === '/signup' && <button className={`${styles.navbarButtonActive} btn`}>Signup</button>}
                  {currentPage !== '/signup' && <button className="btn">Signup</button>}
                </Link>
              </li>
            </>
          )}
        </div>

        {user && (
          <li>
            {/* show different button when waiting for user to click the button, and when logging user out */}
            {isPending && <button className="btn">Logging out...</button>}
            {!isPending && (
              <button className="btn" onClick={logout}>
                Logout
              </button>
            )}
          </li>
        )}
      </ul>
    </div>
  );
}
