import Head from 'next/head';
import Layout from '../../components/Layout';
import Markdown from '../../components/Markdown';
import { Button, Container, makeStyles, Paper, Typography, Box, Chip, Hidden } from '@material-ui/core';
import { ThumbUp, ThumbUpOutlined, VisibilityOutlined, List, EventOutlined } from '@material-ui/icons';
import { GetStaticPaths, GetStaticProps } from 'next';
import prisma from '../../lib/prisma';
import { useState } from 'react';
import dayjs from 'dayjs';

export const getStaticPaths: GetStaticPaths = async () => {
  const articleLink = await prisma.article.findMany({
    select: {
      link: true,
    },
  });

  return {
    paths: articleLink.map(({ link }) => ({ params: { link } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const article = await prisma.article.findFirst({
    where: { link: context.params?.link as string },
    select: {
      title: true,
      summary: true,
      content: true,
      archive: true,
      createdAt: true,
      tags: true,
      updateAt: true,
    },
  });
  return { props: { article: { ...article, tags: article?.tags.map(({ name }) => name) } } };
};

const useStyles = makeStyles((theme) => ({
  articlePaper: {
    paddingBlock: theme.spacing(3),
    paddingInline: theme.spacing(2),
  },
}));

export default function Article({
  article,
}: {
  article: {
    title: string;
    summary: string;
    content: string;
    archive: string;
    createdAt: Date;
    updateAt: Date;
    tags: string[];
  };
}) {
  const classes = useStyles();

  const [isLike, toggleIsLike] = useState<boolean>(false);

  const subtitleChips = (
    <>
      <Chip variant="outlined" icon={<VisibilityOutlined />} label="20" size="small" />
      <Chip
        variant="outlined"
        icon={<List />}
        label={{ code: '编程', study: '学习', website: '建站', game: '游戏', life: '生活' }[article.archive]}
        size="small"
        style={{ marginInline: 4 }}
      />
      <Chip
        variant="outlined"
        icon={<EventOutlined />}
        label={dayjs(article.createdAt).format('YYYY-MM-DD hh:mm:ss')}
        size="small"
      />
    </>
  );

  const main = (
    <>
      <Markdown>{article.content}</Markdown>
      <Box textAlign="center">
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={isLike ? <ThumbUp /> : <ThumbUpOutlined />}
          onClick={() => {
            toggleIsLike(!isLike);
          }}
        >
          {99 + +isLike}
        </Button>
      </Box>
      <Box my={2}>
        {article.tags.map((tag, index) => (
          <Chip key={index} label={tag} style={{ marginRight: 8 }} />
        ))}
      </Box>
      <Box textAlign="end">编辑于:{dayjs(article.updateAt).format('YYYY-MM-DD hh:mm:ss')}</Box>
    </>
  );

  return (
    <>
      <Head>
        <title>{article.title} - 荆棘小栈</title>
        <meta name="description" content={article.summary} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title={`${article.title} - 荆棘小栈`}>
        <Hidden smUp implementation="css">
          <Box textAlign="center" mt={2}>
            {subtitleChips}
          </Box>
          {main}
        </Hidden>
        <Hidden xsDown implementation="css">
          <Container>
            <Paper className={classes.articlePaper}>
              <Typography variant="h2" align="center">
                {article.title}
              </Typography>
              <Box textAlign="end" mt={2}>
                {subtitleChips}
              </Box>
              {main}
            </Paper>
          </Container>
        </Hidden>
      </Layout>
    </>
  );
}
