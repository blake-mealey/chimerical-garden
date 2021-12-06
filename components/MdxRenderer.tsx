import { MDXRemote } from 'next-mdx-remote';
import Link from 'next/link';
import createHeadingComponent from './createHeadingComponent';
import Shortcut from './Shortcut';
import Image from 'next/image';

const shortcodes = {
  Shortcut,
  a: Link,
  img: (props: any) => {
    return (
      // eslint-disable-next-line jsx-a11y/alt-text
      <Image {...props} layout="responsive" loading="eager" quality={100} />
    );
  },
  h1: createHeadingComponent('h1'),
  h2: createHeadingComponent('h2'),
  h3: createHeadingComponent('h3'),
  h4: createHeadingComponent('h4'),
  h5: createHeadingComponent('h5'),
  h6: createHeadingComponent('h6'),
};

const MdxRenderer = function ({ source }: { source: any }) {
  return <MDXRemote {...source} components={shortcodes} />;
};

export default MdxRenderer;
