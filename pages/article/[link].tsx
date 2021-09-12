import { Box, Button, Chip, Container, Hidden, Paper, Typography, makeStyles } from '@material-ui/core';
import { EventOutlined, List, ThumbUp, ThumbUpOutlined, VisibilityOutlined } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Markdown from '../../components/Markdown';
import apolloClient from '../../lib/apolloClient';
import dayjs from 'dayjs';
import { gql } from '@apollo/client';
import prisma from '../../lib/prisma';

/**
 * 判断当前文章是否点赞过
 *
 * @param {string} link 文章链接
 * @return {*}  {boolean}
 */
const getLocalIsLike = (link: string): boolean => {
  if (typeof window !== 'undefined') {
    return (JSON.parse(localStorage.getItem('likedArticles') || '[]') as string[]).includes(link);
  } else {
    return true;
  }
};

/**
 * 在本地储存文章点赞状态
 *
 * @param {string} link 文章链接
 */
const setLocalIsLike = (link: string) => {
  if (typeof window !== 'undefined') {
    const likedArticlesArray = JSON.parse(localStorage.getItem('likedArticles') || '[]') as string[];
    likedArticlesArray.push(link);
    localStorage.setItem('likedArticles', JSON.stringify(likedArticlesArray));
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    await prisma.article.update({
      where: { link: context.params?.link as string },
      data: { watch: { increment: 1 } },
    });
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
        watch: true,
        likes: true,
      },
    });
    return {
      props: { article: { ...article, tags: article?.tags.map(({ name }) => name) }, link: context.params?.link },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

const useStyles = makeStyles((theme) => ({
  articlePaper: {
    paddingBlock: theme.spacing(3),
    paddingInline: theme.spacing(2),
  },
}));

interface ArticlePageProps {
  article: {
    title: string;
    summary: string;
    content: string;
    archive: string;
    createdAt: Date;
    updateAt: Date;
    tags: string[];
    watch: number;
    likes: number;
  };
  link: string;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ article, link }) => {
  const classes = useStyles();

  const [isLike, toggleIsLike] = useState<boolean>(false);

  useEffect(() => {
    toggleIsLike(getLocalIsLike(link));
  }, [link]);

  const handleLike = async () => {
    if (!isLike) {
      try {
        toggleIsLike(true);
        await apolloClient.mutate({
          mutation: gql`
            mutation LikeArticle($link: String!) {
              likeArticle(link: $link) {
                id
              }
            }
          `,
          variables: {
            link,
          },
        });
        setLocalIsLike(link);
      } catch (error) {
        toggleIsLike(false);
        console.error(error);
      }
    }
  };

  const SubtitleChips: React.FC = () => (
    <>
      <Chip variant="outlined" icon={<VisibilityOutlined />} label={article.watch} size="small" />
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
        label={dayjs(article.createdAt).format('YYYY-MM-DD HH:mm:ss')}
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
          onClick={handleLike}
        >
          {getLocalIsLike(link) ? article.likes : article.likes + +isLike}
        </Button>
      </Box>
      <Box my={2}>
        {article.tags.map((tag, index) => (
          <Chip key={index} label={tag} style={{ marginRight: 8 }} />
        ))}
      </Box>
      <Box textAlign="end">编辑于: {dayjs(article.updateAt).format('YYYY-MM-DD HH:mm:ss')}</Box>
    </>
  );

  return (
    <>
      <Head>
        <title>{article.title} - 荆棘小栈</title>
        <meta name="description" content={article.summary} />
        <meta name="keywords" content={article.tags.join(', ')} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title={`${article.title} - 荆棘小栈`}>
        <Hidden smUp implementation="css">
          <Box textAlign="center" mt={2}>
            <SubtitleChips />
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
                <SubtitleChips />
              </Box>
              {main}
            </Paper>
          </Container>
        </Hidden>
      </Layout>
    </>
  );
};

export default ArticlePage;
