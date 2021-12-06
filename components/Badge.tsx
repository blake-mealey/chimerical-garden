import React, { FunctionComponent } from 'react';
import clsx from 'clsx';

import styles from './badge.module.css';

interface BadgeProps {
  variant?: 'warning';
}

const Badge: FunctionComponent<BadgeProps> = ({
  children,
  variant: style = 'warning',
}) => {
  return <span className={clsx(styles.badge, styles[style])}>{children}</span>;
};

export default Badge;
