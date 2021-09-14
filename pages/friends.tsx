import { Alert, AlertTitle } from '@material-ui/lab';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import prisma from '../lib/prisma';

export const getServerSideProps: GetServerSideProps = async () => {
  const friends = await prisma.friend.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      name: true,
      address: true,
      description: true,
      avatar: true,
    },
  });
  return { props: { friends } };
};

const useRowStyles = makeStyles({
  mainRow: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

interface FriendsPageProps {
  friends: {
    name: string;
    address: string;
    description: string;
    avatar: string;
  }[];
}

const FriendsPage: NextPage<FriendsPageProps> = ({ friends }) => {
  const classes = useRowStyles();

  const [showWebsiteInfo, toggleShowWebsiteInfo] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>友链 - 荆棘小栈</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout select="friends" title="友链 - 荆棘小栈">
        <Alert severity="info">
          <AlertTitle>申请友链</AlertTitle>请
          <Link
            color="inherit"
            onClick={() => {
              toggleShowWebsiteInfo(!showWebsiteInfo);
            }}
          >
            <strong>添加本站</strong>
          </Link>
          为友链后 前往Github提交
          <Link href="https://github.com/jsun969/JBlog/issues" color="inherit">
            <strong>申请友链Issue</strong>
          </Link>
        </Alert>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>头像</TableCell>
                <TableCell>名称</TableCell>
                <TableCell>地址</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {friends.map((friend, index) => (
                <React.Fragment key={index}>
                  <TableRow className={classes.mainRow}>
                    <TableCell>
                      <Avatar alt={friend.name} src={friend.avatar} />
                    </TableCell>
                    <TableCell>{friend.name}</TableCell>
                    <TableCell>
                      <Link href={friend.address}>{friend.address}</Link>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} style={{ paddingTop: 0 }}>
                      <strong>{friend.description}</strong>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          open={showWebsiteInfo}
          onClose={() => {
            toggleShowWebsiteInfo(false);
          }}
        >
          <DialogTitle>本站信息</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <div>
                <strong>标题</strong>: 荆棘小栈
              </div>
              <div>
                <strong>地址</strong>: https://jsun969.cn
              </div>
              <div>
                <strong>描述</strong>: 好看的皮囊千篇一律，有趣的灵魂万里挑一
              </div>
              <div>
                <strong>头像</strong>: https://gitee.com/jsun969/assets/raw/master/avatar.png
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                toggleShowWebsiteInfo(false);
              }}
              color="primary"
            >
              关闭
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    </>
  );
};

export default FriendsPage;
