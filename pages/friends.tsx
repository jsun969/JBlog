import { Avatar, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, makeStyles } from '@material-ui/core';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Layout from '../components/Layout';
import React from 'react';
import prisma from '../lib/prisma';

export const getServerSideProps: GetServerSideProps = async () => {
  const friends = await prisma.friend.findMany({
    orderBy: { createdAt: 'desc' },
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

const FriendsPage: React.FC<FriendsPageProps> = ({ friends }) => {
  const classes = useRowStyles();

  return (
    <>
      <Head>
        <title>友链 - 荆棘小栈</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout select="friends" title="友链 - 荆棘小栈">
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
      </Layout>
    </>
  );
};

export default FriendsPage;
