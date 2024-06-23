import styles from './LoadingPage.module.css';
import { RiLoader4Line } from '@remixicon/react';

export function LoadingPage() {
  return (
    <div className={styles['container']}>
      <RiLoader4Line className={styles['icon']} />
      <p className={styles['text']}>Loading...</p>
    </div>
  );
}
