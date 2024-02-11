import styles from './index.module.scss';

export default function Instructions() {
  return (
    <div className={styles.instructions}>
      <h3>Instruction:</h3>
      <ul>
        <li>Players get 2 cards each initially.</li>
        <li>Taking turns, they can choose to draw another card or skip.</li>
        <li>The player with the highest number of points wins!</li>
        <li>
          Points are calculated as: the sum of all their card&apos;s rank mod
          10. J, Q, K cards add no value.
        </li>
      </ul>
    </div>
  );
}
