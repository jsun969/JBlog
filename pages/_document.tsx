import { Head, Html, Main, NextScript } from 'next/document';
import Document from 'next/document';
import React from 'react';
import { ServerStyleSheets } from '@material-ui/core/styles';
import theme from '../lib/theme';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="theme-color" content={theme.palette.primary.main} />
          <meta name="image" content="https://gitee.com/jsun969/assets/raw/master/avatar.png" />
          <meta property="og:site_name" content="荆棘小栈" />
          <meta property="og:image" content="https://gitee.com/jsun969/assets/raw/master/avatar.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};
