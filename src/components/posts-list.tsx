import React, { FunctionComponent } from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import getPostPath from '../getPostPath';

const PostsLists: FunctionComponent = () => {
  const data = useStaticQuery(graphql`
    query {
      allMdx(
        filter: {
          frontmatter: { type: { eq: "post" }, status: { eq: "published" } }
        }
      ) {
        nodes {
          id
          frontmatter {
            title
            date(formatString: "MMMM D, YYYY")
          }
        }
      }
    }
  `);

  const { nodes: posts } = data.allMdx;

  return (
    <ul>
      {posts.map((post: any) => (
        <li key={post.id}>
          <Link to={getPostPath(post.frontmatter.title)}>
            {post.frontmatter.title} ({post.frontmatter.date})
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PostsLists;
