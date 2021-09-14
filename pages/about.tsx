import { Box, Chip, Container, Hidden, Paper, makeStyles } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import { EventOutlined } from '@material-ui/icons';
import Head from 'next/head';
import Layout from '../components/Layout';
import Markdown from '../components/Markdown';
import dayjs from 'dayjs';
import prisma from '../lib/prisma';

export const getServerSideProps: GetServerSideProps = async () => {
  const article = await prisma.about.findFirst({
    select: {
      content: true,
      updateAt: true,
    },
  });
  return {
    props: { article },
  };
};

const useStyles = makeStyles((theme) => ({
  articlePaper: {
    paddingBlock: theme.spacing(3),
    paddingInline: theme.spacing(2),
  },
}));

interface AboutPageProps {
  article?: {
    content: string;
    updateAt: Date;
  };
}

const AboutPage: NextPage<AboutPageProps> = ({ article = { content: '', updateAt: new Date() } }) => {
  const classes = useStyles();

  const Main: React.FC = () => (
    <>
      <Markdown>{article?.content || ''}</Markdown>
      <Box textAlign="end">
        <Chip icon={<EventOutlined />} label={dayjs(article?.updateAt).format('YYYY-MM-DD HH:mm:ss')} size="small" />
      </Box>
    </>
  );

  return (
    <>
      <Head>
        <title>介绍 - 荆棘小栈</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title="介绍 - 荆棘小栈" select="about">
        <Hidden smUp implementation="css">
          <Main />
        </Hidden>
        <Hidden xsDown implementation="css">
          <Container>
            <Paper className={classes.articlePaper}>
              <Main />
            </Paper>
          </Container>
        </Hidden>
      </Layout>
    </>
  );
};

export default AboutPage;
