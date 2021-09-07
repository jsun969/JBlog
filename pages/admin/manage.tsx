import { Delete, Edit } from '@material-ui/icons';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { GetServerSideProps } from 'next';
import Layout from '../../components/admin/Layout';
import prisma from '../../lib/prisma';

export const getServerSideProps: GetServerSideProps = async () => {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
    },
  });
  return { props: { articles } };
};

interface ManagePageProps {
  articles: {
    id: number;
    title: string;
  }[];
}

const ManagePage: React.FC<ManagePageProps> = ({ articles }) => {
  return (
    <Layout select="manage">
      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>ID</TableCell>
            <TableCell>标题</TableCell>
            <TableCell>操作</TableCell>
          </TableHead>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>{article.id}</TableCell>
                <TableCell>{article.title}</TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  <IconButton size="small">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

export default ManagePage;
