import { FormEvent, useState } from 'react';
import styles from './RegisterForm.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { authService } from '../../services/auth-service';

export function RegisterForm() {
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();

  const {
    trigger: handleSubmit,
    loading,
    error,
  } = useAsyncAction(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await authService.register({
      email,
      firstName,
      lastName,
      password,
    });
    navigate('/chats');
  });

  return (
    <section className={styles['register-section']}>
      <h1>Please fill in the following fields to register</h1>
      <form onSubmit={handleSubmit} className={styles['register-form']}>
        {!!error && <span>Could not register</span>}

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit">{loading ? 'Loading' : 'Register'}</button>
      </form>
      <Link to={'/login'} className={styles['link']}>
        <p className={styles['register-p']}>
          You already have an acount? <i>click here</i> to login
        </p>
      </Link>
    </section>
  );
}
