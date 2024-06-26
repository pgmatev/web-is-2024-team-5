import React from 'react';
import { HttpError, InputError } from '../../services/http-service.ts';
import styles from './ErrorComponent.module.css';

interface ErrorComponentProps {
  error: unknown;
  field?: string;
}

export const ErrorComponent: React.FC<ErrorComponentProps> = ({
  error,
  field,
}) => {
  if (error instanceof InputError && field) {
    return (
      <div className={styles['error-list']}>
        {error.fieldErrors && error.fieldErrors[field] && (
          <ul>
            {error.fieldErrors[field]?.map(
              (errorMessage: string, index: number) => (
                <li key={index}>{errorMessage}</li>
              ),
            )}
          </ul>
        )}
      </div>
    );
  }

  if (error instanceof HttpError) {
    return <div className={styles['error-basic']}>{error.message}</div>;
  }

  return null;
};
