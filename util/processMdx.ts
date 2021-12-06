import { serialize } from 'next-mdx-remote/serialize';
import imageSize from 'rehype-img-size';
import { dirname } from 'path';

async function processMdx(source: string, file: string) {
  console.log('FILE', file);

  return await serialize(source, {
    mdxOptions: {
      filepath: file,
      rehypePlugins: [[imageSize, { dir: 'public' }]],
    },
  });
}

export default processMdx;
