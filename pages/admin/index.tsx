import { Grid, Typography } from '@material-ui/core';
import Layout from '../../components/admin/Layout';
import { NextPage } from 'next';
import React from 'react';
import dayjs from 'dayjs';

const AdminHomePage: NextPage = () => {
  const greet = () => {
    const time = dayjs().hour();
    if ([0, 1, 2, 3, 4, 5].includes(time)) {
      return '凌晨好';
    } else if ([6, 7, 8, 9, 10].includes(time)) {
      return '早上好';
    } else if ([11, 12].includes(time)) {
      return '中午好';
    } else if ([13, 14, 15, 16, 17, 18].includes(time)) {
      return '下午好';
    } else if ([19, 20, 21, 22, 23].includes(time)) {
      return '晚上好';
    }
  };

  return (
    <>
      <Layout select="index">
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '80vh' }}
        >
          <Typography variant="h3">{greet()}, 荆棘</Typography>
        </Grid>
      </Layout>
    </>
  );
};

export default AdminHomePage;
