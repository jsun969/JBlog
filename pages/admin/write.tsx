import { Button, Grid, MenuItem, Paper, TextField, Typography } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import { Autocomplete } from '@material-ui/lab';
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

const WritePage: NextPage<WritePageProps> = ({ tagsExist, linksExist }) => {
  const [title, setTitle] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [archive, setArchive] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [createdAt, setCreatedAt] = useState<string>('');

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
            $createdAt: String
          ) {
            createArticle(
              title: $title
              summary: $summary
              link: $link
              archive: $archive
              content: $content
              tags: $tags
              createdAt: $createdAt
            ) {
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
          createdAt,
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
                label="??????"
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
                label="??????"
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
                label="????????????"
                variant="outlined"
                value={link}
                onChange={(event) => {
                  setLink(event.target.value);
                }}
                error={linksExist.includes(link)}
                helperText={linksExist.includes(link) && '??????????????????'}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="??????"
                value={archive}
                onChange={(event) => {
                  setArchive(event.target.value);
                }}
                select
                variant="outlined"
                fullWidth
              >
                <MenuItem value="code">??????</MenuItem>
                <MenuItem value="study">??????</MenuItem>
                <MenuItem value="website">??????</MenuItem>
                <MenuItem value="game">??????</MenuItem>
                <MenuItem value="life">??????</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="??????(Markdown)"
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
                renderInput={(params) => <TextField {...params} variant="outlined" label="??????" fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="????????????"
                variant="outlined"
                value={createdAt}
                onChange={(event) => {
                  setCreatedAt(event.target.value);
                }}
                error={
                  !/\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1]) (0\d|1\d|2[0-3])(:([0-5]\d)){2}/.test(createdAt) &&
                  !!createdAt
                }
                helperText={
                  !/\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1]) (0\d|1\d|2[0-3])(:([0-5]\d)){2}/.test(createdAt) &&
                  !!createdAt &&
                  '??????????????????'
                }
              />
            </Grid>
            <Grid container item xs={12} justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={
                  !(
                    title &&
                    summary &&
                    link &&
                    archive &&
                    content &&
                    !linksExist.includes(link) &&
                    tags.length &&
                    (/\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1]) (0\d|1\d|2[0-3])(:([0-5]\d)){2}/.test(createdAt) ||
                      !createdAt)
                  )
                }
                onClick={handlePost}
              >
                ??????
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
            {postStatus === Status.success && <Typography variant="h4">????????????, ??????ID: {id}</Typography>}
            {postStatus === Status.error && <Typography variant="h4">????????????</Typography>}
          </Grid>
        )}
      </Layout>
    </>
  );
};

export default WritePage;
