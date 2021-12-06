import React from 'react';
import { NextPage } from 'next';
import Layout from '../components/Layout';

const NotFound: NextPage = () => {
  return (
    <Layout slug={'/undefined'} meta={{ title: 'Not found', type: 'page' }}>
      Page not found 😢
    </Layout>
  );
};

export default NotFound;
