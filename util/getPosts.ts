import { promises } from 'fs';
import { resolve } from 'path';
import matter from 'gray-matter';

const { readdir, readFile } = promises;

export type Post = {
  slug: string;
  title: string;
  date: string;
  status: 'draft' | 'published';
  content: string;
  dir: string;
  file: string;
};

function getPostSlug(title: string) {
  return encodeURIComponent(title.toLowerCase().replace(/ /g, '-'));
}

async function getPosts() {
  const postsDir = resolve(process.cwd(), '_posts');
  const postDirectories = await readdir(postsDir);
  const posts: Post[] = await Promise.all(
    postDirectories.map(async (dir) => {
      const postDir = resolve(postsDir, dir);
      const filePath = resolve(postDir, 'index.mdx');
      const source = await readFile(filePath, 'utf8');
      const { data, content } = matter(source);
      return {
        slug: getPostSlug(data.title),
        title: data.title,
        date: data.date.toISOString(),
        status: data.status,
        content,
        dir: postDir,
        file: filePath,
      };
    })
  );
  posts.sort((a, b) => b.date.localeCompare(a.date));

  return posts;
}

export default getPosts;
