/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';
import clsx from 'clsx';

import './reset.css';
import './theme.css';

import styles from './layout.module.css';
import SEO from './seo';
import Badge from './badge';

const Nav: FunctionComponent = () => {
  return (
    <nav className={clsx(styles.block, styles.nav)}>
      <ul className={styles.navList}>
        <li>
          <Link to="/">home</Link>
        </li>
        <li>
          <Link to="/work">work</Link>
        </li>
        <li>
          <Link to="/posts">posts</Link>
        </li>
      </ul>
    </nav>
  );
};

interface PageProps {
  path: string;
  pageContext: {
    frontmatter: {
      type: 'post' | 'page';
      title: string;
      status?: 'draft' | 'published';
    };
  };
}

const Layout: FunctionComponent<PageProps> = ({
  children,
  path,
  pageContext: { frontmatter },
}) => {
  const unpublished =
    frontmatter.type === 'post' && frontmatter.status !== 'published';

  return (
    <div>
      <SEO title={frontmatter.title} />

      <Nav />

      <header className={clsx(styles.block, styles.header)}>
        <h1>{`~${path}`}</h1>

        {unpublished && <Badge style="warning">{frontmatter.status}</Badge>}
      </header>

      <main className={clsx(styles.block, styles.main)}>{children}</main>
    </div>
  );
};

export default Layout;
