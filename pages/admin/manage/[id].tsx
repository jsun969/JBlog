import { Button, Grid, MenuItem, Paper, TextField, Typography, makeStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { GetServerSideProps } from 'next';
import Layout from '../../../components/admin/Layout';
import Markdown from '../../../components/Markdown';
import apolloClient from '../../../lib/apolloClient';
import { gql } from '@apollo/client';
import prisma from '../../../lib/prisma';
import { useState } from 'react';

/**
 * 判断两个非重复数组是否相等
 *
 * @param {any[]} arr1
 * @param {any[]} arr2
 * @return {*}  {boolean}
 */
const uniqueArrayEqual = (arr1: any[], arr2: any[]): boolean => {
  return arr1.length === arr2.length && arr1.every((element) => arr2.includes(element));
};

export const getServerSideProps: GetServerSideProps = async (context) => {
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
  const article = await prisma.article.findFirst({
    where: { id: +(context.params?.id as string) },
    select: {
      id: true,
      title: true,
      summary: true,
      link: true,
      archive: true,
      content: true,
      tags: true,
    },
  });
  return {
    props: {
      article: { ...article, tags: article?.tags.map(({ name }) => name) },
      tagsExist: tagsExist.map(({ name }) => name),
      linksExist: linksExist.map(({ link }) => link),
    },
  };
};

const useStyles = makeStyles(() => ({
  modifiedTextField: {
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#3f51b5',
    },
  },
}));

interface ModifyPageProps {
  article: {
    id: number;
    title: string;
    summary: string;
    link: string;
    archive: string;
    content: string;
    tags: string[];
  };
  tagsExist: string[];
  linksExist: string[];
}

const ModifyPage: React.FC<ModifyPageProps> = ({ article, tagsExist, linksExist }) => {
  const classes = useStyles();

  const [title, setTitle] = useState<string>(article.title);
  const [summary, setSummary] = useState<string>(article.summary);
  const [link, setLink] = useState<string>(article.link);
  const [archive, setArchive] = useState<string>(article.archive);
  const [content, setContent] = useState<string>(article.content);
  const [tags, setTags] = useState<string[]>(article.tags);

  enum Status {
    None,
    Success,
    Error,
  }
  const [submitStatus, setSubmitStatus] = useState<Status>(Status.None);

  const handleSubmit = async () => {
    try {
      await apolloClient.mutate({
        mutation: gql`
          mutation ModifyArticle(
            $id: Int!
            $title: String
            $summary: String
            $link: String
            $archive: String
            $content: String
            $tags: [String]
          ) {
            modifyArticle(
              id: $id
              title: $title
              summary: $summary
              link: $link
              archive: $archive
              content: $content
              tags: $tags
            ) {
              id
            }
          }
        `,
        variables: {
          id: article.id,
          title: title !== article.title ? title : undefined,
          summary: summary !== article.summary ? summary : undefined,
          link: link !== article.link ? link : undefined,
          archive: archive !== article.archive ? archive : undefined,
          content: content !== article.content ? content : undefined,
          tags: !uniqueArrayEqual(tags, article.tags) ? tags : undefined,
        },
      });
      setSubmitStatus(Status.Success);
    } catch (error) {
      console.error(error);
      setSubmitStatus(Status.Error);
    }
  };

  return (
    <Layout select="manage">
      {submitStatus === Status.None && (
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
              className={title !== article.title && title ? classes.modifiedTextField : undefined}
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
              className={summary !== article.summary && summary ? classes.modifiedTextField : undefined}
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
              error={linksExist.includes(link) && link !== article.link}
              helperText={linksExist.includes(link) && link !== article.link && '链接地址重复'}
              className={link !== article.link && link && !linksExist.includes(link) ? classes.modifiedTextField : undefined}
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
              className={archive !== article.archive && archive ? classes.modifiedTextField : undefined}
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
              className={content !== article.content && content ? classes.modifiedTextField : undefined}
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
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="标签"
                  fullWidth
                  className={!uniqueArrayEqual(tags, article.tags) && tags.length ? classes.modifiedTextField : undefined}
                />
              )}
            />
          </Grid>
          <Grid container item xs={12} justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={
                !(
                  title !== article.title ||
                  summary !== article.summary ||
                  link !== article.link ||
                  archive !== article.archive ||
                  content !== article.content ||
                  !uniqueArrayEqual(tags, article.tags)
                ) ||
                !(
                  title &&
                  summary &&
                  link &&
                  archive &&
                  content &&
                  !(linksExist.includes(link) && link !== article.link) &&
                  tags.length
                )
              }
              onClick={handleSubmit}
            >
              修改
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
      {(submitStatus === Status.Error || submitStatus === Status.Success) && (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '80vh' }}
        >
          {submitStatus === Status.Success && <Typography variant="h4">修改成功</Typography>}
          {submitStatus === Status.Error && <Typography variant="h4">修改失败</Typography>}
        </Grid>
      )}
    </Layout>
  );
};

export default ModifyPage;
