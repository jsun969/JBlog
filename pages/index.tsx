import ArticleCard from '../components/ArticleCard';
import { GetStaticProps } from 'next';
import { Grid } from '@material-ui/core';
import Head from 'next/head';
import Layout from '../components/Layout';
import dayjs from 'dayjs';
import prisma from '../lib/prisma';

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
      watch: true,
      likes: true,
    },
  });
  return {
    props: {
      articles: articles.map(({ tags, ...info }) => ({
        tags: tags.map(({ name }) => name),
        ...info,
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
    watch: number;
    likes: number;
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
                watch={article.watch}
                time={dayjs(article.createdAt).format('YYYY-MM-DD')}
                likes={article.likes}
                link={article.link}
              />
            </Grid>
          ))}
        </Grid>
      </Layout>
    </div>
  );
}
