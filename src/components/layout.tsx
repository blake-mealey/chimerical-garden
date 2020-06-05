/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { FunctionComponent } from 'react';

import './reset.css';
import './theme.css';

import styles from './layout.module.css';
import { Link } from 'gatsby';

const Layout: FunctionComponent = ({ children }) => {
  return (
    <div>
      {/* TODO: <SEO title={frontmatter.title} /> */}
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li>
            <Link to="/">home</Link>
          </li>
          <li>
            <Link to="/posts">posts</Link>
          </li>
        </ul>
      </nav>
      <header className={styles.header}>
        <h1>{`~${window.location.pathname}`}</h1>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
};

// TODO: Get frontmatter

export default Layout;
