import React, { FunctionComponent } from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import getPostPath from '../getPostPath';

interface PostsListsProps {
  status: string;
}

const PostsLists: FunctionComponent<PostsListsProps> = ({ status }) => {
  const data = useStaticQuery(graphql`
    query {
      allMdx(filter: { frontmatter: { type: { eq: "post" } } }) {
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

  console.log(posts);

  const filtered = posts.filter(
    (post: any) => post.frontmatter.status === status
  );

  return (
    <ul>
      {filtered.map((post: any) => (
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
