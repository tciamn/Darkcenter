import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.eyebrow}>Community Data Tool</div>
        <h1 className={styles.title}>Who's Paying the Price for the AI Boom?</h1>
        <p className={styles.subtitle}>
          2,820 data centers across the US. Real energy use, real emissions,
          real health impacts — translated into plain language.
        </p>
      </div>
    </header>
  );
}
