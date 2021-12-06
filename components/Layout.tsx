import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Layout.module.css';
import clsx from 'clsx';
import Link from 'next/link';
import Badge from '../components/Badge';
import formatDate from '../util/formatDate';

type LayoutProps = {
  slug: string;
  meta: {
    type: 'post' | 'page';
    title: string;
    status?: 'draft' | 'published';
    date?: string;
  };
};

const Layout: NextPage<LayoutProps> = ({ children, slug, meta }) => {
  const isPost = meta.type === 'post';
  const isDraft = isPost && meta.status !== 'published';

  return (
    <div className={styles.container}>
      <Head>
        {/* TODO: SEO */}
        <title>{meta.title}</title>
        <meta name="description" content="Blake Mealey's personal website." />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <nav className={clsx(styles.block, styles.nav)}>
        <ul className={clsx(styles.navList)}>
          <li>
            <Link href="/home">home</Link>
          </li>
          <li>
            <Link href="/work">work</Link>
          </li>
          <li>
            <Link href="/posts">posts</Link>
          </li>
        </ul>
      </nav>

      <header className={clsx(styles.block, styles.header)}>
        <h1>{'~' + slug}</h1>

        {isDraft && <Badge variant="warning">{meta.status}</Badge>}
        {/* TODO: drafts */}
      </header>

      <main className={clsx(styles.block, styles.main)}>
        {meta.date && <time dateTime={meta.date}>{formatDate(meta.date)}</time>}

        {children}
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
