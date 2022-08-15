import { removeSpecialChars } from '../../custom/customFunctions';

// hooks
import { useState } from 'react';
import { useSignup } from '../../hooks/useSignup';

// styles, utilises the same styling as login form
import '../login/Login.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [profPic, setProfPic] = useState('');
  const [profPicError, setProfPicError] = useState('');
  const { error, isPending, setError, signup } = useSignup();

  const handleFileChange = event => {
    // remove any previously selected file from profile pic state object
    setProfPic(null);

    let selectedFile = event.target.files[0];

    // if no file is selected
    if (!selectedFile) {
      setProfPicError('Please select a file.');
      // return will stop the code running from this point on, so user can remedy the error
      return;
    }
    // if file type is not an image
    if (!selectedFile.type.includes('image')) {
      setProfPicError('Selected file must be an image.');
      return;
    }
    // if file size is greater than 100kb
    if (selectedFile.size > 100000) {
      setProfPicError('Image file size needs to be less than 100kb.');
      return;
    }

    // remove any previous errors from profile pic error object (once user fixes up the issue, the error will still remain until removed here)
    setProfPicError(null);

    // update profile picture
    setProfPic(selectedFile);
  };

  const handleSubmit = event => {
    event.preventDefault();
    // arguments being passed in need to match the order of how they're defined in the signup function in useSignup.js
    signup(email, password, displayName, profPic);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Signup</h2>

      {/* label doesn't need htmlFor as it wraps the associated span and input elements */}
      <label>
        <p>Email:</p>
        <input
          type="email"
          required
          // set value as the email state, so if email is changed outside of this input, it will update here accordingly to remain in sync
          value={email}
          onChange={event => {
            setEmail(event.target.value);
          }}
        />
      </label>

      <label>
        <p>Password:</p>
        <input
          type="password"
          required
          value={password}
          onChange={event => {
            setPassword(event.target.value);
          }}
        />
      </label>

      <label>
        <p>Display Name:</p>
        <input
          type="text"
          required
          value={displayName}
          onChange={event => {
            // stop user from using special chars in the display name
            if (/^[a-z0-9\s]+$/gi.test(event.target.value)) {
              setDisplayName(removeSpecialChars(event.target.value));
            } else {
              setError('Display name can only contain alphanumeric characters.');
            }
          }}
        />
      </label>

      <label>
        <p>Profile Picture:</p>
        <input
          type="file"
          required
          // value={email}
          onChange={handleFileChange}
        />
      </label>

      {/* show different button when waiting for user to click the button, and when signing user up */}
      <div className="center-button-wrapper">
        {!isPending && <button className="btn">Signup</button>}
        {isPending && (
          <button className="btn" disabled>
            Signing you up...
          </button>
        )}
      </div>

      {/* show any errors that may arise when signing user up */}
      {profPicError && <div className="err">{profPicError}</div>}
      {error && <div className="err">{error}</div>}
    </form>
  );
}
