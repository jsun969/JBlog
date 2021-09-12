import { Button, Grid, MenuItem, Paper, TextField, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { GetServerSideProps } from 'next';
import Layout from '../../components/admin/Layout';
import Markdown from '../../components/Markdown';
import apolloClient from '../../lib/apolloClient';
import { gql } from '@apollo/client';
import prisma from '../../lib/prisma';
import { useState } from 'react';

export const getServerSideProps: GetServerSideProps = async () => {
  const tagsExist = await prisma.tag.findMany({
    select: {
      name: true,
    },
  });
  const linksExist = await prisma.article.findMany({
    select: {
      link: true,
    },
  });
  return {
    props: {
      tagsExist: tagsExist.map(({ name }) => name),
      linksExist: linksExist.map(({ link }) => link),
    },
  };
};

interface WritePageProps {
  tagsExist: string[];
  linksExist: string[];
}

const WritePage: React.FC<WritePageProps> = ({ tagsExist, linksExist }) => {
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [archive, setArchive] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  enum Status {
    none,
    success,
    error,
  }
  const [postStatus, setPostStatus] = useState<Status>(Status.none);
  const [id, setId] = useState<number>();

  const handlePost = async () => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation CreateArticle(
            $title: String!
            $summary: String!
            $link: String!
            $archive: String!
            $content: String!
            $tags: [String]!
          ) {
            createArticle(title: $title, summary: $summary, link: $link, archive: $archive, content: $content, tags: $tags) {
              id
            }
          }
        `,
        variables: {
          title,
          summary,
          link,
          archive,
          content,
          tags,
        },
      });
      setId(data.createArticle.id);
      setPostStatus(Status.success);
    } catch (error) {
      console.error(error);
      setPostStatus(Status.error);
    }
  };

  return (
    <>
      <Layout select="write">
        {postStatus === Status.none && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="标题"
                variant="outlined"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="摘要"
                variant="outlined"
                multiline
                minRows={3}
                value={summary}
                onChange={(event) => {
                  setSummary(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="链接地址"
                variant="outlined"
                value={link}
                onChange={(event) => {
                  setLink(event.target.value);
                }}
                error={linksExist.includes(link)}
                helperText={linksExist.includes(link) && '链接地址重复'}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="归档"
                value={archive}
                onChange={(event) => {
                  setArchive(event.target.value);
                }}
                select
                variant="outlined"
                fullWidth
              >
                <MenuItem value="code">编程</MenuItem>
                <MenuItem value="study">学习</MenuItem>
                <MenuItem value="website">建站</MenuItem>
                <MenuItem value="game">游戏</MenuItem>
                <MenuItem value="life">生活</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="内容(Markdown)"
                variant="outlined"
                multiline
                minRows={10}
                value={content}
                onChange={(event) => {
                  setContent(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={tagsExist}
                value={tags}
                onChange={(_, value) => {
                  setTags(value);
                }}
                renderInput={(params) => <TextField {...params} variant="outlined" label="标签" fullWidth />}
              />
            </Grid>
            <Grid container item xs={12} justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={!(title && summary && link && archive && content && !linksExist.includes(link) && tags.length)}
                onClick={handlePost}
              >
                发布
              </Button>
            </Grid>
            <Grid item xs={12}>
              {content && (
                <Paper variant="outlined" style={{ paddingLeft: 16, paddingRight: 16 }}>
                  <Markdown>{content}</Markdown>
                </Paper>
              )}
            </Grid>
          </Grid>
        )}
        {(postStatus === Status.success || postStatus === Status.error) && (
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '80vh' }}
          >
            {postStatus === Status.success && <Typography variant="h4">发布成功, 文章ID: {id}</Typography>}
            {postStatus === Status.error && <Typography variant="h4">发布失败</Typography>}
          </Grid>
        )}
      </Layout>
    </>
  );
};

export default WritePage;
