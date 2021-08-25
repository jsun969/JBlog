import { GetStaticProps } from 'next';
import Head from 'next/head';
import { Grid } from '@material-ui/core';
import ArticleCard from '../components/ArticleCard';
import Layout from '../components/Layout';
import prisma from '../lib/prisma';
import dayjs from 'dayjs';

export const getStaticProps: GetStaticProps = async () => {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      link: true,
      title: true,
      summary: true,
      createdAt: true,
      tags: true,
    },
  });
  return {
    props: {
      articles: articles.map(({ id, link, title, summary, createdAt, tags }) => ({
        id,
        link,
        title,
        summary,
        createdAt,
        tags: tags.map(({ name }) => name),
      })),
    },
  };
};

export default function Home({
  articles,
}: {
  articles: {
    id: number;
    link: string;
    title: string;
    summary: string;
    createdAt: string;
    tags: string[];
  }[];
}) {
  return (
    <div>
      <Head>
        <title>荆棘小栈 - 主页</title>
        <meta name="description" content="欢迎访问荆棘的个人博客,在这里,会分享我生活和编程的点滴时光" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title="荆棘小栈" select="index">
        <Grid container spacing={3}>
          {articles.map((article) => (
            <Grid item key={article.id} xs={12} sm={6} md={4}>
              <ArticleCard
                title={article.title}
                summary={article.summary}
                tags={article.tags}
                watch={3}
                time={dayjs(article.createdAt).format('YYYY-MM-DD')}
                commentsCount={200}
              />
            </Grid>
          ))}
        </Grid>
      </Layout>
    </div>
  );
}
