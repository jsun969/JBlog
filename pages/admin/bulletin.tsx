import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import Layout from '../../components/admin/Layout';
import Markdown from '../../components/Markdown';
import apolloClient from '../../lib/apolloClient';
import { gql } from '@apollo/client';
import prisma from '../../lib/prisma';
import { useState } from 'react';

export const getServerSideProps: GetServerSideProps = async () => {
  const bulletin = await prisma.bulletin.findFirst({ select: { content: true } });
  return {
    props: {
      bulletin,
    },
  };
};

interface ModifyBulletinPageProps {
  bulletin: {
    content: string;
  };
}

const ModifyBulletinPage: NextPage<ModifyBulletinPageProps> = ({ bulletin }) => {
  const [content, setContent] = useState<string>(bulletin?.content || '');

  enum Status {
    None,
    Success,
    Error,
  }
  const [submitStatus, setSubmitStatus] = useState<Status>(Status.None);

  const handleSubmit = async () => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation ModifyBulletin($content: String!) {
            modifyBulletin(content: $content)
          }
        `,
        variables: {
          content,
        },
      });
      if (data.modifyBulletin) {
        setSubmitStatus(Status.Success);
      }
    } catch (error) {
      console.error(error);
      setSubmitStatus(Status.Error);
    }
  };

  return (
    <Layout select="bulletin">
      {submitStatus === Status.None && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="内容"
              variant="outlined"
              multiline
              minRows={10}
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
              }}
            />
          </Grid>
          <Grid container item xs={12} justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={content === (bulletin?.content || '')}
              onClick={handleSubmit}
            >
              修改
            </Button>
          </Grid>
          <Grid item xs={12}>
            {content && (
              <Paper variant="outlined" style={{ paddingLeft: 16, paddingRight: 16 }}>
                <div style={{ marginBlock: 16 }}>{content}</div>
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

export default ModifyBulletinPage;
