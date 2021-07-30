import Head from 'next/head';
import Layout from '../components/layout';

export default function Home() {
  return (
    <div>
      <Head>
        <title>荆棘小栈 - 主页</title>
        <meta name="description" content="欢迎访问荆棘的个人博客,在这里,会分享我生活和编程的点滴时光" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title="荆棘小栈" select="index">
        lol
      </Layout>
    </div>
  );
}
