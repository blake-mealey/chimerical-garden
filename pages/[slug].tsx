import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Layout from '../components/Layout';
import matter from 'gray-matter';
import { promises } from 'fs';
import { resolve } from 'path';
import MdxRenderer from '../components/MdxRenderer';
import processMdx from '../util/processMdx';

const { readFile } = promises;

type PageProps = {
  slug: string;
  source: any;
  meta: {
    title: string;
  };
};

const Page: NextPage<PageProps> = ({ slug, source, meta }) => {
  if (slug === '/home') {
    slug = '/';
  }
  return (
    <Layout slug={slug} meta={{ ...meta, type: 'page' }}>
      <MdxRenderer source={source} />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const slug = params?.slug;
  if (!slug) {
    throw new Error('No slug provided');
  }
  const file = resolve(process.cwd(), '_pages', `${slug}.mdx`);
  const source = await readFile(file, 'utf8');
  const { content, data } = matter(source);
  const mdxSource = await processMdx(content, file);
  return {
    props: {
      source: mdxSource,
      slug: `/${slug}`,
      meta: {
        title: data.title,
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: ['/home', '/work'],
    fallback: false,
  };
};

export default Page;
