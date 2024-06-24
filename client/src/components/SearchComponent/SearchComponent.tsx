import { RiSearch2Line } from '@remixicon/react';
import styles from './SearchComponent.module.css';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

export interface SearchComponentProps {
  onSearch: (search: string) => void;
}

export function SearchComponent({ onSearch }: SearchComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        onSearch(searchTerm);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [onSearch, searchTerm]);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    [],
  );

  return (
    <div className={styles['search-bar']}>
      <input
        type="search"
        placeholder="Search..."
        className={styles['search-input']}
        value={searchTerm}
        onChange={handleSearchChange}
      ></input>
      <RiSearch2Line className={styles['ri-search-2-line']} />
    </div>
  );
}
