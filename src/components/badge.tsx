import React, { FunctionComponent } from 'react';
import clsx from 'clsx';

import styles from './badge.module.css';

interface BadgeProps {
  style?: 'warning';
}

const Badge: FunctionComponent<BadgeProps> = ({
  children,
  style = 'warning',
}) => {
  return <span className={clsx(styles.badge, styles[style])}>{children}</span>;
};

export default Badge;
