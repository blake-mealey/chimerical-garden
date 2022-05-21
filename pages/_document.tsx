import { Html, Main, NextScript, Head } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" type="image/svg+xml" href="favicon.svg" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap"
        />
        <script src="https://cdn.splitbee.io/sb.js" async></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
