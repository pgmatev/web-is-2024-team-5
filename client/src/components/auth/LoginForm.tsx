import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth-service';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import styles from "./LoginForm.module.css";

export function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const navigate = useNavigate();

  const { trigger: handleSubmit } = useAsyncAction(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        await authService.login({ email, password });
        navigate('/chats');
      } catch (error) {
        setError(true);
      }
    },
  );

  return (
    <section className={styles['login-section']}>
      <h1>Welcome back, please Login</h1>
      <form onSubmit={handleSubmit} className={styles['login-form']}>
        {error && <span>Could not log in</span>}
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
        <button type="submit">Login</button>
      </form>
      <Link to={'/register'} className={styles['link']}>
        <p className={styles['login-p']}>If you dont have an acount, <i>click here</i> to register</p>
      </Link>
      
    </section>
  );
}
