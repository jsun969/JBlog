import Head from 'next/head';
import { Button } from '@material-ui/core';
import { Note } from '@material-ui/icons';

export default function Home() {
  return (
    <div>
      <Head>
        <title>荆棘小栈</title>
        <meta name="description" content="荆棘的博客 jsun969's blog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Button variant="contained" color="primary">
          <Note />
          测试
        </Button>
      </main>

      <footer></footer>
    </div>
  );
}
