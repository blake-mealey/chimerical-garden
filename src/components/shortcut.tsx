import React, { FunctionComponent, Children } from 'react';

import styles from './shortcut.module.css';

function joinShortcut(keys: JSX.Element[]) {
  return keys.length > 0
    ? keys.reduce((result, item) => (
        <>
          {result}+{item}
        </>
      ))
    : null;
}

const Shortcut: FunctionComponent = ({ children }) => {
  const child = Children.toArray(children).join('+');
  const keys = child?.toString().split('+');

  return (
    <span className={styles.shortcut}>
      {joinShortcut(keys?.map((key) => <kbd key={key}>{key}</kbd>))}
    </span>
  );
};

export default Shortcut;
