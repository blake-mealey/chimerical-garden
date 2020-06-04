import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';

const NotFoundPage = () => (
  <Layout title="/404">
    <SEO title="404: Not found" />
    <p>Page not found 😢</p>
  </Layout>
);

export default NotFoundPage;
