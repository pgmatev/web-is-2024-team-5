import styles from "./RegisterForm.module.css"
import { Link} from 'react-router-dom';

export function RegisterForm() {
  return (
    <section className={styles['register-section']}>
      <h1>Please fill in the following fields to register</h1>
      <form action="/auth/register" method="POST" className={styles['register-form']}>
        <input type="text" name="username" placeholder="Username" required />
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
      <Link to={'/login'} className={styles['link']}>
        <p className={styles['register-p']}>You already have an acount? <i>click here</i> to login</p>
      </Link>
    </section>
  );
}
