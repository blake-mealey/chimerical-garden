import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Layout from '../../components/Layout';
import MdxRenderer from '../../components/MdxRenderer';
import getPosts from '../../util/getPosts';
import processMdx from '../../util/processMdx';

type PageProps = {
  slug: string;
  source: any;
  meta: {
    title: string;
    date: string;
    status: 'draft' | 'published';
  };
};

const Page: NextPage<PageProps> = ({ slug, source, meta }) => {
  if (slug === '/home') {
    slug = '/';
  }
  return (
    <Layout slug={slug} meta={{ ...meta, type: 'post' }}>
      <MdxRenderer source={source} />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const slug = params?.slug;
  if (!slug) {
    throw new Error('No slug provided');
  }

  const posts = await getPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    throw new Error();
  }

  const mdxSource = await processMdx(post.content, post.file);
  return {
    props: {
      source: mdxSource,
      slug: `/posts/${slug}`,
      meta: {
        title: post.title,
        date: post.date,
        status: post.status,
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();

  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
};

export default Page;
