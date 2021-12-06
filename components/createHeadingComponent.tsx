import React, { FunctionComponent } from 'react';

import styles from './heading.module.css';

interface HeadingProps {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
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

const createHeadingComponent = (
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
) => {
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => {
    return <Heading tag={tag}>{children}</Heading>;
  };
};

export default createHeadingComponent;
