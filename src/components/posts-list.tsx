import React, { FunctionComponent } from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import getPostPath from '../getPostPath';

interface PostsListsProps {
  heading: string;
  description: string;
  postStatus: string;
}

const PostsLists: FunctionComponent<PostsListsProps> = ({
  heading,
  description,
  postStatus,
}) => {
  const data = useStaticQuery(graphql`
    query {
      allMdx(
        sort: { order: DESC, fields: frontmatter___date }
        filter: { frontmatter: { type: { eq: "post" } } }
      ) {
        nodes {
          id
          frontmatter {
            title
            status
            date(formatString: "MMMM D, YYYY")
          }
        }
      }
    }
  `);

  const { nodes: posts } = data.allMdx;

  const filtered = posts.filter(
    (post: any) => post.frontmatter.status === postStatus
  );

  if (filtered.length === 0) {
    return null;
  }

  return (
    <>
      <h2>{heading}</h2>
      <p>{description}</p>
      <ul>
        {filtered.map((post: any) => (
          <li key={post.id}>
            <Link to={getPostPath(post.frontmatter.title)}>
              {post.frontmatter.title} ({post.frontmatter.date})
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default PostsLists;
