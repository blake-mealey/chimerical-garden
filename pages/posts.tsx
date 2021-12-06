import React, { FunctionComponent } from 'react';
import { GetStaticProps, NextPage } from 'next';
import Layout from '../components/Layout';
import Link from 'next/link';
import formatDate from '../util/formatDate';
import getPosts, { Post } from '../util/getPosts';

interface PostsListsProps {
  heading: string;
  description: string;
  posts: Post[];
}

const PostsLists: FunctionComponent<PostsListsProps> = ({
  heading,
  description,
  posts,
}) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <>
      <h2>{heading}</h2>
      <p>{description}</p>
      <ul>
        {posts.map((post) => (
          <li key={post.title}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>{' '}
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </li>
        ))}
      </ul>
    </>
  );
};

type PostsProps = {
  posts: Post[];
};

const Posts: NextPage<PostsProps> = ({ posts }) => {
  const draftPosts = posts.filter((post) => post.status === 'draft');
  const publishedPosts = posts.filter((post) => post.status === 'published');

  return (
    <Layout slug={'/posts'} meta={{ title: 'Posts', type: 'page' }}>
      <PostsLists
        heading="Posts"
        description="A collection of my thoughts."
        posts={publishedPosts}
      />
      <PostsLists
        heading="Drafts"
        description="My unfinished thoughts."
        posts={draftPosts}
      />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<PostsProps> = async () => {
  const posts = await getPosts();

  return { props: { posts } };
};

export default Posts;
