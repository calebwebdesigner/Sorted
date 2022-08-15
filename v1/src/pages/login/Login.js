// hooks
import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { error, isPending, login } = useLogin();

  const handleSubmit = event => {
    event.preventDefault();
    login(email, password);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login</h2>

      <label>
        <p>Email:</p>
        <input
          type="email"
          required
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

      <div className="center-button-wrapper">
        {!isPending && <button className="btn">Login</button>}
        {isPending && (
          <button className="btn" disabled>
            Logging you in...
          </button>
        )}
      </div>

      {error && <div className="err">{error}</div>}
    </form>
  );
}
