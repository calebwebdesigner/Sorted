import { Timestamp } from 'firebase/firestore';
import Select from 'react-select';
import { removeSomeSpecialChars } from '../../custom/customFunctions';

// hooks
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useFirestore } from '../../hooks/useFirestore';
import { useNavContext } from '../../hooks/useNavContext';

// styles
import styles from './Create.module.css';

const categories = [
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Development' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
];

export default function Create() {
  const navigate = useNavigate();

  // useFirestore hook, used to add the new project to the 'projects' collection
  // collections specified here that don't exist in firestore yet, will be created automatically
  const { addDocument, response } = useFirestore('projects');

  // get each user from collection, name returned array documents
  const { documents } = useCollection('users');

  // used to list who can be assigned to the project
  const [users, setUsers] = useState([]);

  // user object, so we know who created the project
  const { user } = useAuthContext();

  // form field values
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [formError, setFormError] = useState(null);

  // get dispatch function from NavContext
  const { dispatch } = useNavContext();
  // define pageTitle to be used on page and passed into NavContext
  const localPageTitle = 'Create New Project';

  // dispatch is inside useEffect with an empty dependency array so it only runs once, otherwise it'll cause an infinite loop
  useEffect(() => {
    // dispatch will run navReducer, and the state object as it is currenty will be passed in, along with the action object defined here "{ type: 'PAGE_LOADED', payload: pageTitle }", the switch function will run case "'PAGE_LOADED'" and update the state object with the defined changes, thereby causing any components using that state object (in this case the navbar) to be re-rendered with the new state object
    dispatch({ type: 'PAGE_LOADED', payload: localPageTitle });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty dependency array will cause useEffect to fire once when the component is rendered

  useEffect(() => {
    // useEffect will fire on component load, so only if documents have loaded, then run the code
    if (documents) {
      // for each document, return an object with a value and label (what Select needs to work)
      const options = documents.map(user => {
        return { value: user, label: user.displayName };
      });
      // set users state object to the array of user values/labels just created
      setUsers(options);
    }
  }, [documents]); // when documents variable changes, this function will fire

  const handleSubmit = async event => {
    // stop default javascript submit actions
    event.preventDefault();

    // reset errors so previous errors won't stop a valid submission from going through
    setFormError(null);
    // perform error checking
    if (!category) {
      setFormError('Please select a project category.');
      // return, which will stop any further code in this function from running
      return;
    }
    // an empty array still has value, need to perform a different check to see if it's empty or not
    else if (assignedUsers.length < 1) {
      setFormError('Please select at least one user to assign this project to.');
      return;
    }

    // the documents returned from the firestore collection have the id set as "uid", not id
    const createdBy = { displayName: user.displayName, photoURL: user.photoURL, id: user.uid };
    const assignedUsersList = assignedUsers.map(assignedUser => {
      // within the assignedUsers objects, the id is called "id"
      return { displayName: assignedUser.value.displayName, photoURL: assignedUser.value.photoURL, id: assignedUser.value.id };
    });
    const newProject = {
      // sanitise name and details inputs, the rest are multi-option inputs (or not directly inputted by the user), so there's no need to sanitise them on the front-end
      name: removeSomeSpecialChars(name),
      details: removeSomeSpecialChars(details),
      // create firebase timestamp object from the dueDate object
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      category: category.value,
      // users will be able to comment on the project once it's created
      comments: [],
      createdBy,
      assignedUsersList,
    };

    // await will cause code to wait here until addDocument has finished running, before continuing
    await addDocument(newProject);
    // if response from addDocument doesn't have errors
    if (!response.error) {
      navigate('/');
    }
  };

  return (
    <div className={styles.createForm}>
      <form onSubmit={handleSubmit}>
        {/* users assigned to project */}
        <label>
          <p>Assign to:</p>
          {/* isMulti allows multiple selections to be selected */}
          <Select options={users} onChange={option => setAssignedUsers(option)} isMulti />
        </label>

        {/* project name */}
        <label>
          <p>Project Name:</p>
          <input
            type="text"
            required
            onChange={event => {
              setName(event.target.value);
            }}
            value={name}
          />
        </label>

        {/* project category */}
        <label>
          <p>Category:</p>
          {/* Select takes an array of objects with a value and a label each, then shows them as a nicely designed select dropdown menu */}
          <Select options={categories} onChange={option => setCategory(option)} />
        </label>

        {/* project due date */}
        <label>
          <p>Due Date:</p>
          <input
            type="date"
            required
            onChange={event => {
              setDueDate(event.target.value);
            }}
            value={dueDate}
          />
        </label>

        {/* project details */}
        <label>
          <p>Details:</p>
          <textarea
            type="text"
            required
            onChange={event => {
              setDetails(event.target.value);
            }}
            value={details}></textarea>
        </label>

        {/* errors */}
        {formError && <p className="err">{formError}</p>}

        <div className="center-button-wrapper">
          <button className="btn">Create Project</button>
        </div>
      </form>
    </div>
  );
}
