import { serialize } from 'next-mdx-remote/serialize';
import imageSize from 'rehype-img-size';
import prism from 'remark-prism';

async function processMdx(source: string, file: string) {
  return await serialize(source, {
    mdxOptions: {
      filepath: file,
      rehypePlugins: [[imageSize, { dir: 'public' }]],
      remarkPlugins: [
        [
          prism,
          { theme: 'Night Owl', extensions: ['night-owl', 'vscode-toml'] },
        ],
      ],
    },
  });
}

export default processMdx;
