import styles from "./Header.module.css";

export function Header() {
    return <header className={styles['top-content']}>
                <h1 className={styles['header-title']} id="user-name"></h1>
                <div className={styles["search-bar"]}>
                    <input type="search" placeholder="Search..." className={styles["search-input"]} />
                    <i className="ri-search-2-line"></i>
                </div>
            </header>;
}