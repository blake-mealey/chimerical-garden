import React, { FunctionComponent } from 'react';

import styles from './heading.module.css';

interface HeadingProps {
  tag: string;
}

const Heading: FunctionComponent<HeadingProps> = ({ children, tag: Tag }) => {
  const text = React.Children.toArray(children)[0].toString();
  const id = encodeURIComponent(text.toLowerCase().replace(/ /g, '-'));

  return (
    <Tag id={id} className={styles.heading}>
      <a href={`#${id}`} className={styles.permalink}>
        →
      </a>
      {children}
    </Tag>
  );
};

export const heading = (tag: string) => {
  return ({ children }: { children: React.ReactNode }) => {
    return <Heading tag={tag}>{children}</Heading>;
  };
};
