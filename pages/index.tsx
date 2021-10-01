import { Alert, AlertTitle } from '@material-ui/lab';
import { GetServerSideProps, NextPage } from 'next';
import ArticleCardList from '../components/ArticleCardList';
import Head from 'next/head';
import Layout from '../components/Layout';
import prisma from '../lib/prisma';

export const getServerSideProps: GetServerSideProps = async () => {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      link: true,
      title: true,
      summary: true,
      createdAt: true,
      tags: true,
      watch: true,
      likes: true,
    },
  });
  const bulletin = await prisma.bulletin.findFirst({ select: { content: true } });
  return {
    props: {
      articles: articles.map(({ tags, ...info }) => ({
        tags: tags.map(({ name }) => name),
        ...info,
      })),
      bulletin,
    },
  };
};

interface HomePageProps {
  articles: {
    id: number;
    link: string;
    title: string;
    summary: string;
    createdAt: string;
    tags: string[];
    watch: number;
    likes: number;
  }[];
  bulletin: {
    content: string;
  };
}

const HomePage: NextPage<HomePageProps> = ({ articles, bulletin }) => {
  return (
    <>
      <Head>
        <title>荆棘小栈 - 主页</title>
        <meta name="description" content="欢迎访问荆棘的个人博客, 在这里, 会分享我生活和编程的点滴时光" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title="荆棘小栈" select="index">
        {bulletin?.content && (
          <Alert severity="info" style={{ marginBottom: 16 }}>
            <AlertTitle>
              <strong>公告</strong>
            </AlertTitle>
            {bulletin?.content}
          </Alert>
        )}
        <ArticleCardList articles={articles} />
      </Layout>
    </>
  );
};

export default HomePage;
