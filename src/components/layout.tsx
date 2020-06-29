/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import clsx from 'clsx';
import Shortcut from './shortcut';
import { heading } from './heading';

import './reset.css';
import './theme.css';

import styles from './layout.module.css';
import SEO from './seo';
import Badge from './badge';

const shortcodes = {
  Shortcut,
  h1: heading('h1'),
  h2: heading('h2'),
  h3: heading('h3'),
  h4: heading('h4'),
  h5: heading('h5'),
  h6: heading('h6'),
};

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
  pageContext: {
    frontmatter: {
      type: 'post' | 'page';
      title: string;
      status?: 'draft' | 'published';
    };
    slug: string;
  };
}

const Layout: FunctionComponent<PageProps> = ({ children, pageContext }) => {
  const { frontmatter, slug } = pageContext || {};

  const isPost = frontmatter?.type === 'post';
  const isDraft = isPost && frontmatter?.status !== 'published';

  return (
    <div>
      <SEO title={frontmatter?.title} />

      <Nav />

      <header className={clsx(styles.block, styles.header)}>
        <h1>{`~${slug}`}</h1>

        {isDraft && <Badge style="warning">{frontmatter?.status}</Badge>}
      </header>

      <main className={clsx(styles.block, styles.main)}>
        <MDXProvider components={shortcodes}>{children}</MDXProvider>
      </main>

      {isPost && (
        <footer className={clsx(styles.block, styles.postFooter)}>
          <ul>
            <li>
              Question or comment? Let me know on{' '}
              <a href="https://twitter.com/blakemdev">Twitter</a>!
            </li>

            <li>
              Did I make a mistake or miss something? Submit a{' '}
              <a href="https://github.com/blake-mealey/chimerical-garden/tree/master/content/posts">
                Pull Request
              </a>{' '}
              to make an edit!
            </li>
          </ul>
        </footer>
      )}
    </div>
  );
};

export default Layout;
