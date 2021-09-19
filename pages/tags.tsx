import { Badge, Button } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import Link from 'next/link';
import prisma from '../lib/prisma';

export const getServerSideProps: GetServerSideProps = async () => {
  const tags = await prisma.tag.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: { articles: true },
      },
    },
  });
  return {
    props: { tags: tags.map(({ _count, ...data }) => ({ ...data, count: _count?.articles! })) },
  };
};

interface TagsPageProps {
  tags: {
    id: number;
    name: string;
    count: number;
  }[];
}

const TagsPage: NextPage<TagsPageProps> = ({ tags }) => {
  return (
    <>
      <Head>
        <title>标签 - 荆棘小栈</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout select="tags" title="标签 - 荆棘小栈">
        {tags.map((tag) => (
          <Badge key={tag.id} badgeContent={tag.count} color="secondary" style={{ margin: 8 }}>
            <Link href={`/tag/${tag.id}`} passHref>
              <Button variant="outlined">{tag.name}</Button>
            </Link>
          </Badge>
        ))}
      </Layout>
    </>
  );
};

export default TagsPage;
