import { Delete, Edit } from '@material-ui/icons';
import { GetServerSideProps, NextPage } from 'next';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import ConfirmDialog from '../../../components/admin/ConfirmDialog';
import Layout from '../../../components/admin/Layout';
import Link from 'next/link';
import apolloClient from '../../../lib/apolloClient';
import { gql } from '@apollo/client';
import prisma from '../../../lib/prisma';
import { useState } from 'react';

export const getServerSideProps: GetServerSideProps = async () => {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      likes: true,
      watch: true,
    },
  });
  return { props: { articles } };
};

interface Article {
  id: number;
  title: string;
  likes: number;
  watch: number;
}
interface ManagePageProps {
  articles: Article[];
}

const ManagePage: NextPage<ManagePageProps> = ({ articles }) => {
  const [stateArticles, setArticles] = useState<Article[]>(articles);
  const [showDeleteDialog, toggleShowDeleteDialog] = useState<boolean>(false);
  const [deleteArticleTitle, setDeleteArticleTitle] = useState<string>('');
  const [deleteArticleID, setDeleteArticleID] = useState<number>(-1);

  const handleDelete = async () => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation DeleteArticle($id: Int!) {
            deleteArticle(id: $id)
          }
        `,
        variables: {
          id: deleteArticleID,
        },
      });
      if (data.deleteArticle) {
        setArticles(stateArticles.filter(({ id }) => id !== deleteArticleID));
        toggleShowDeleteDialog(false);
      }
    } catch (error) {
      console.error(error);
      toggleShowDeleteDialog(false);
    }
  };

  return (
    <Layout select="manage">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>标题</TableCell>
              <TableCell>获赞</TableCell>
              <TableCell>浏览</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stateArticles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>{article.id}</TableCell>
                <TableCell>{article.title}</TableCell>
                <TableCell>{article.likes}</TableCell>
                <TableCell>{article.watch}</TableCell>
                <TableCell>
                  <Link href={`/admin/manage/${article.id}`} passHref>
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                  </Link>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setDeleteArticleTitle(article.title);
                      setDeleteArticleID(article.id);
                      toggleShowDeleteDialog(true);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        title="删除文章?"
        content={`将删除文章《${deleteArticleTitle}》`}
        open={showDeleteDialog}
        onClose={() => {
          toggleShowDeleteDialog(false);
        }}
        onConfirm={handleDelete}
      />
    </Layout>
  );
};

export default ManagePage;
