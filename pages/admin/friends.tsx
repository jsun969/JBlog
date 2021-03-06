import { ArrowDownward, ArrowUpward, Delete, Edit } from '@material-ui/icons';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Layout from '../../components/admin/Layout';
import apolloClient from '../../lib/apolloClient';
import dayjs from 'dayjs';
import { gql } from '@apollo/client';
import prisma from '../../lib/prisma';

export const getServerSideProps: GetServerSideProps = async () => {
  const friends = await prisma.friend.findMany({
    orderBy: { order: 'asc' },
    select: {
      id: true,
      name: true,
      address: true,
      description: true,
      avatar: true,
      order: true,
      createdAt: true,
    },
  });
  return { props: { friends } };
};

interface Friend {
  id: number;
  name: string;
  address: string;
  description: string;
  avatar: string;
  order: number;
  index?: number;
  createdAt: Date;
}

interface FriendsPageProps {
  friends: Friend[];
}

const FriendsPage: NextPage<FriendsPageProps> = ({ friends }) => {
  const [stateFriends, setFriends] = useState<Friend[]>(friends.map((friend, index) => ({ ...friend, index })));

  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const handleCreate = async () => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation CreateFriend($name: String!, $address: String!, $description: String!, $avatar: String!) {
            createFriend(name: $name, address: $address, description: $description, avatar: $avatar)
          }
        `,
        variables: { name, address, description, avatar },
      });
      if (data.createFriend) {
        setFriends([
          ...stateFriends,
          { id: data.createFriend, name, address, description, avatar, order: data.createFriend, createdAt: new Date() },
        ]);
        setName('');
        setAddress('');
        setDescription('');
        setAvatar('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [openModifyDialog, toggleOpenModifyDialog] = useState<boolean>(false);
  const [modifyFriend, setModifyFriend] = useState<Partial<Friend>>({});
  const handleModify = async () => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation ModifyFriend($id: Int!, $name: String, $address: String, $description: String, $avatar: String) {
            modifyFriend(id: $id, name: $name, address: $address, description: $description, avatar: $avatar)
          }
        `,
        variables: {
          id: modifyFriend.id,
          name: modifyFriend.name,
          address: modifyFriend.address,
          description: modifyFriend.description,
          avatar: modifyFriend.avatar,
        },
      });
      if (data.modifyFriend) {
        setFriends(stateFriends.map((friend) => (friend.id === modifyFriend.id ? { ...friend, ...modifyFriend } : friend)));
        toggleOpenModifyDialog(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [openDeleteDialog, toggleOpenDeleteDialog] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number>(-1);
  const [deleteName, setDeleteName] = useState<string>('');
  const handleDelete = async () => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation DeleteFriend($id: Int!) {
            deleteFriend(id: $id)
          }
        `,
        variables: {
          id: deleteId,
        },
      });
      if (data.deleteFriend) {
        setFriends(stateFriends.filter((friend) => friend.id !== deleteId));
        toggleOpenDeleteDialog(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * ????????????
   *
   * @param {Friend} friend ???????????????
   */
  const handleMoveUp = (friend: Friend) => {
    const originFriendIndex = stateFriends.findIndex(({ id }) => id === friend.id);
    const prevFriendIndex = originFriendIndex === 0 ? stateFriends.length - 1 : originFriendIndex - 1;
    const originFriend = friend;
    const prevFriend = stateFriends[prevFriendIndex];
    setFriends(
      stateFriends.map((friend, index) => {
        if (index === originFriendIndex) {
          return prevFriend;
        } else if (index === prevFriendIndex) {
          return originFriend;
        } else {
          return friend;
        }
      })
    );
  };
  /**
   * ????????????
   *
   * @param {Friend} friend ???????????????
   */
  const handleMoveDown = (friend: Friend) => {
    const originFriendIndex = stateFriends.findIndex(({ id }) => id === friend.id);
    const nextFriendIndex = originFriendIndex === stateFriends.length - 1 ? 0 : originFriendIndex + 1;
    const originFriend = friend;
    const nextFriend = stateFriends[nextFriendIndex];
    setFriends(
      stateFriends.map((friend, index) => {
        if (index === originFriendIndex) {
          return nextFriend;
        } else if (index === nextFriendIndex) {
          return originFriend;
        } else {
          return friend;
        }
      })
    );
  };

  const [showModifyOrderButton, toggleShowModifyOrderButton] = useState<boolean>(true);
  const [orderDiff, setOrderDiff] = useState<{ id: number; order: number }[]>([]);
  useEffect(() => {
    if (friends.length !== stateFriends.length) {
      toggleShowModifyOrderButton(false);
    }
    const orders = stateFriends.map(({ order }) => order).sort((a, b) => a - b);
    stateFriends.forEach(({ index: originIndex, id }, index) => {
      if (originIndex !== index) {
        setOrderDiff((prevOrderDiff) => [...prevOrderDiff, { id, order: orders[index] }]);
      }
    });
    return () => {
      setOrderDiff([]);
    };
  }, [stateFriends, friends]);

  const handleModifyOrder = async () => {
    try {
      console.log(orderDiff);
      const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation ModifyFriendsOrder($orders: [Order]!) {
            modifyFriendsOrder(orders: $orders)
          }
        `,
        variables: {
          orders: orderDiff,
        },
      });
      if (data.modifyFriendsOrder) {
        setFriends(stateFriends.map((friend, index) => ({ ...friend, index })));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout select="friends">
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="??????"
            variant="outlined"
            margin="dense"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="??????"
            variant="outlined"
            margin="dense"
            value={address}
            onChange={(event) => {
              setAddress(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="??????"
            variant="outlined"
            margin="dense"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="??????"
            variant="outlined"
            margin="dense"
            value={avatar}
            onChange={(event) => {
              setAvatar(event.target.value);
            }}
          />
        </Grid>
        <Grid container item xs={12} justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={!(name && address && description && avatar)}
            onClick={handleCreate}
          >
            ??????
          </Button>
        </Grid>
      </Grid>
      <TableContainer>
        <Table>
          <TableBody>
            {stateFriends.map((friend) => (
              <TableRow key={friend.id}>
                <TableCell>
                  <IconButton size="small" onClick={() => handleMoveUp(friend)}>
                    <ArrowUpward />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleMoveDown(friend)}>
                    <ArrowDownward />
                  </IconButton>
                </TableCell>
                <TableCell align="center">{friend.name}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setModifyFriend(friend);
                      toggleOpenModifyDialog(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setDeleteId(friend.id);
                      setDeleteName(friend.name);
                      toggleOpenDeleteDialog(true);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showModifyOrderButton && (
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: 16 }}
          onClick={handleModifyOrder}
          disabled={orderDiff.length === 0}
        >
          ????????????
        </Button>
      )}
      <Dialog
        open={openModifyDialog}
        onClose={() => {
          toggleOpenModifyDialog(false);
        }}
      >
        <DialogTitle>????????????</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="??????"
            value={modifyFriend?.name}
            onChange={(event) => {
              setModifyFriend({ ...modifyFriend, name: event.target.value });
            }}
            fullWidth
          />
          <TextField
            margin="dense"
            label="??????"
            value={modifyFriend?.address}
            onChange={(event) => {
              setModifyFriend({ ...modifyFriend, address: event.target.value });
            }}
            fullWidth
          />
          <TextField
            margin="dense"
            label="??????"
            value={modifyFriend?.description}
            onChange={(event) => {
              setModifyFriend({ ...modifyFriend, description: event.target.value });
            }}
            fullWidth
          />
          <TextField
            margin="dense"
            label="??????"
            value={modifyFriend?.avatar}
            onChange={(event) => {
              setModifyFriend({ ...modifyFriend, avatar: event.target.value });
            }}
            fullWidth
          />
          <Typography color="textSecondary" variant="caption">
            ?????????{dayjs(modifyFriend?.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              toggleOpenModifyDialog(false);
            }}
            color="primary"
          >
            ??????
          </Button>
          <Button onClick={handleModify} color="primary">
            ??????
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={openDeleteDialog}
        title="?????????????"
        content={`??????????????? ${deleteName}`}
        onClose={() => {
          toggleOpenDeleteDialog(false);
        }}
        onConfirm={handleDelete}
      />
    </Layout>
  );
};

export default FriendsPage;
