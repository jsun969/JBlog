import { Box, Button, Chip, Container, Hidden, Link, Paper, Typography, makeStyles } from '@material-ui/core';
import { EventOutlined, List, ThumbUp, ThumbUpOutlined, VisibilityOutlined } from '@material-ui/icons';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../../components/Layout';
import Markdown from '../../components/Markdown';
import apolloClient from '../../lib/apolloClient';
import dayjs from 'dayjs';
import { gql } from '@apollo/client';
import prisma from '../../lib/prisma';
import { useRouter } from 'next/dist/client/router';

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
        modifiedAt: true,
        watch: true,
        likes: true,
      },
    });
    return {
      props: { article, link: context.params?.link },
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
    modifiedAt: Date;
    tags: { id: number; name: string }[];
    watch: number;
    likes: number;
  };
  link: string;
}

const ArticlePage: NextPage<ArticlePageProps> = ({ article, link }) => {
  const classes = useStyles();
  const router = useRouter();

  const [isLike, toggleIsLike] = useState<boolean>(false);

  useEffect(() => {
    toggleIsLike(getLocalIsLike(link));
  }, [link]);

  const handleLike = async () => {
    if (!isLike) {
      try {
        toggleIsLike(true);
        const { data } = await apolloClient.mutate({
          mutation: gql`
            mutation LikeArticle($link: String!) {
              likeArticle(link: $link)
            }
          `,
          variables: {
            link,
          },
        });
        if (data.likeArticle) {
          setLocalIsLike(link);
        }
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
        label={{ code: '开发', study: '学习', website: '建站', game: '游戏', life: '生活' }[article.archive]}
        size="small"
        style={{ marginInline: 4 }}
        onClick={(e) => {
          e.preventDefault();
          router.push(`/archive/${article.archive}`);
        }}
      />
      <Chip
        variant="outlined"
        icon={<EventOutlined />}
        label={dayjs(article.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        size="small"
      />
    </>
  );

  const Main: React.FC = () => (
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
          <Chip
            key={index}
            label={tag.name}
            style={{ marginRight: 8 }}
            onClick={(e) => {
              e.preventDefault();
              router.push(`/tag/${tag.id}`);
            }}
          />
        ))}
      </Box>
      <Box textAlign="end">编辑于: {dayjs(article.modifiedAt).format('YYYY-MM-DD HH:mm:ss')}</Box>
      <Box>
        <Image alt="知识共享许可协议" src="/cc-by-nc-sa-4.0.png" width="80" height="31" />
      </Box>
      <Typography variant="caption">
        本作品采用
        <Link href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
          知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议
        </Link>
        进行许可
      </Typography>
    </>
  );

  return (
    <>
      <Head>
        <title>{article.title} - 荆棘小栈</title>
        <meta name="description" content={article.summary} />
        <meta name="keywords" content={article.tags.map(({ name }) => name).join(', ')} />
        <meta property="og:title" content={`${article.title} - 荆棘小栈`} />
        <meta property="og:description" content={article.summary} />
        <meta property="og:type" content="article" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout title={`${article.title} - 荆棘小栈`}>
        <Hidden smUp implementation="css">
          <Box textAlign="center" mt={2}>
            <SubtitleChips />
          </Box>
          <Main />
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
              <Main />
            </Paper>
          </Container>
        </Hidden>
      </Layout>
    </>
  );
};

export default ArticlePage;
