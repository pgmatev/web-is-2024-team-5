import { useState, useCallback, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          },
        );

        if (!response.ok) {
          throw new Error('Login failed');
        }
        console.log('made it to navigate?');
        navigate('/chats');
      } catch (error) {
        setError(true);
      }
    },
    [email, navigate, password],
  );

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
    </>
  );
}
