import { GetServerSideProps, NextPage } from 'next';
import ArticleCardList from '../../components/ArticleCardList';
import Head from 'next/head';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!['code', 'study', 'website', 'game', 'life'].includes(context.params?.archive as string)) {
    return {
      notFound: true,
    };
  }
  const articles = await prisma.article.findMany({
    where: { archive: context.params?.archive as string },
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
      archive: context.params?.archive as string,
    },
  };
};

interface ArchivePageProps {
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
  archive: 'code' | 'study' | 'website' | 'game' | 'life';
}

const ArchivePage: NextPage<ArchivePageProps> = ({ articles, archive }) => {
  return (
    <>
      <Head>
        <title>{{ code: '开发', study: '学习', website: '建站', game: '游戏', life: '生活' }[archive]}归档 - 荆棘小栈</title>
      </Head>
      <Layout
        title={`${{ code: '开发', study: '学习', website: '建站', game: '游戏', life: '生活' }[archive]}归档 - 荆棘小栈`}
        select={archive}
      >
        <ArticleCardList articles={articles} />
      </Layout>
    </>
  );
};

export default ArchivePage;
