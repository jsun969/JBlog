import { GetServerSideProps, NextPage } from 'next';
import ArticleCardList from '../../components/ArticleCardList';
import Head from 'next/head';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tag = await prisma.tag.findFirst({
    where: {
      id: +context.params?.id!,
    },
  });
  const articles = await prisma.article.findMany({
    where: {
      tags: {
        some: {
          id: +context.params?.id!,
        },
      },
    },
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
  if (!tag) {
    return {
      notFound: true,
    };
  } else {
    return {
      props: {
        articles: articles.map(({ tags, ...info }) => ({
          tags: tags.map(({ name }) => name),
          ...info,
        })),
        tag: tag?.name,
      },
    };
  }
};

interface TagPageProps {
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
  tag: string;
}

const TagPage: NextPage<TagPageProps> = ({ articles, tag }) => {
  return (
    <>
      <Head>
        <title>{tag}标签 - 荆棘小栈</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title={`${tag}标签 - 荆棘小栈`} select="tags">
        <ArticleCardList articles={articles} />
      </Layout>
    </>
  );
};

export default TagPage;
