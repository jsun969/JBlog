import { ReactNode, useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  Hidden,
  Grid,
  Box,
} from '@material-ui/core';
import { ExitToApp, Menu } from '@material-ui/icons';
import { makeStyles, Theme } from '@material-ui/core/styles';
import apolloClient from '../../lib/apolloClient';
import { gql, useQuery } from '@apollo/client';
import LogoutDialog from './LogoutDialog';
import LoginForm from './LoginForm';
import Link from 'next/link';

const drawerWidth = 100;
const useStyles = makeStyles((theme: Theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbar: theme.mixins.toolbar,
  title: {
    flexGrow: 1,
  },
  drawer: {
    width: drawerWidth,
  },
  drawerContent: {
    width: drawerWidth,
  },
  nestedList: {
    paddingLeft: theme.spacing(4),
  },
  main: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: drawerWidth,
    },
  },
  loginPaper: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
  },
}));

const GET_ADMIN_BY_TOKEN = gql`
  query AdminAuth($key: String!) {
    adminAuth(key: $key, isJwt: true) {
      status
    }
  }
`;

export default function Layout({
  children,
  select = 'write',
}: {
  children: ReactNode;
  select: 'write' | 'list' | 'friends' | 'about' | 'comment' | 'index';
}) {
  const classes = useStyles();

  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const [isDrawerOpen, toggleIsDrawerOpen] = useState<boolean>(false);
  const [showLogoutDialog, toggleShowLogoutDialog] = useState<boolean>(false);
  const [isLogin, toggleIsLogin] = useState<boolean>(false);
  const [passKey, setPassKey] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  const [adminToken, setAdminToken] = useState<string>('');
  useEffect(() => {
    setAdminToken(localStorage.getItem('adminToken') || '');
  }, []);
  const { loading, error, data } = useQuery(GET_ADMIN_BY_TOKEN, {
    variables: {
      key: adminToken,
    },
  });
  useEffect(() => {
    toggleIsLogin(data?.adminAuth.status);
  }, [data]);

  const handleLogin = async () => {
    try {
      setLoginLoading(true);
      const { data } = await apolloClient.query({
        query: gql`
          query AdminAuth($key: String!) {
            adminAuth(key: $key, isJwt: false) {
              status
              jwt
            }
          }
        `,
        variables: { key: passKey },
      });
      if (data.adminAuth.status) {
        localStorage.setItem('adminToken', data.adminAuth.jwt);
        toggleIsLogin(true);
      }
      setPassKey('');
      setLoginLoading(false);
    } catch (error) {
      console.log(error);
      setPassKey('');
      setLoginLoading(false);
    }
  };

  const drawerContent = (
    <div className={classes.drawerContent}>
      <Hidden xsDown implementation="css">
        <div className={classes.toolbar} />
      </Hidden>
      <List>
        <Link href="/admin" passHref>
          <ListItem button selected={select === 'index'}>
            <ListItemText primary="后台首页" />
          </ListItem>
        </Link>
        <ListItem button selected={select === 'list'}>
          <ListItemText primary="文章管理" />
        </ListItem>
        <Link href="/admin/write" passHref>
          <ListItem button selected={select === 'write'}>
            <ListItemText primary="撰写文章" />
          </ListItem>
        </Link>
        <ListItem button selected={select === 'comment'}>
          <ListItemText primary="评论管理" />
        </ListItem>
        <ListItem button selected={select === 'friends'}>
          <ListItemText primary="友链管理" />
        </ListItem>
        <ListItem button selected={select === 'about'}>
          <ListItemText primary="修改关于" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <>
      <header>
        <AppBar position="sticky" className={classes.appBar}>
          <Toolbar>
            {isLogin && (
              <Hidden smUp implementation="css">
                <IconButton
                  edge="start"
                  color="inherit"
                  className={classes.menuButton}
                  onClick={() => {
                    toggleIsDrawerOpen(true);
                  }}
                >
                  <Menu />
                </IconButton>
              </Hidden>
            )}
            <Typography variant="h6" className={classes.title}>
              荆棘小栈 - 后台
            </Typography>
            {isLogin && (
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => {
                  toggleShowLogoutDialog(true);
                }}
              >
                <ExitToApp />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
        {isLogin && (
          <nav>
            <Hidden smUp implementation="css">
              <SwipeableDrawer
                open={isDrawerOpen}
                onClose={() => {
                  toggleIsDrawerOpen(false);
                }}
                onOpen={() => {
                  toggleIsDrawerOpen(true);
                }}
                disableBackdropTransition={!iOS}
                disableDiscovery={iOS}
              >
                {drawerContent}
              </SwipeableDrawer>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Drawer open variant="permanent" className={classes.drawer}>
                {drawerContent}
              </Drawer>
            </Hidden>
          </nav>
        )}
      </header>

      <main className={isLogin ? classes.main : undefined}>
        {isLogin ? (
          <Box m={3}>{children}</Box>
        ) : (
          <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
            {loading ? (
              <Typography>加载中...</Typography>
            ) : error ? (
              <Box m={5}>
                <Typography>{`${error}`}</Typography>
              </Box>
            ) : (
              <LoginForm
                passKey={passKey}
                onChangeKey={(value) => {
                  setPassKey(value);
                }}
                onLogin={handleLogin}
                disabled={loginLoading}
              />
            )}
          </Grid>
        )}
      </main>
      <LogoutDialog
        open={showLogoutDialog}
        onClose={() => {
          toggleShowLogoutDialog(false);
        }}
        onConfirm={() => {
          toggleIsLogin(false);
          localStorage.removeItem('adminToken');
          toggleShowLogoutDialog(false);
        }}
      />
    </>
  );
}
