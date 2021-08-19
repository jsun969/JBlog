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
  Paper,
  TextField,
  Button,
  Grid,
  Box,
} from '@material-ui/core';
import { ExitToApp, Menu } from '@material-ui/icons';
import { makeStyles, Theme } from '@material-ui/core/styles';
import client from '../../lib/apolloClient';
import { gql, useQuery } from '@apollo/client';
import LogoutDialog from './LogoutDialog';

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
  const [key, setKey] = useState<string>('');
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
      const { data } = await client.query({
        query: gql`
          query AdminAuth($key: String!) {
            adminAuth(key: $key, isJwt: false) {
              status
              jwt
            }
          }
        `,
        variables: { key },
      });
      if (data.adminAuth.status) {
        localStorage.setItem('adminToken', data.adminAuth.jwt);
        toggleIsLogin(true);
      }
      setKey('');
      setLoginLoading(false);
    } catch (error) {
      console.log(error);
      setKey('');
      setLoginLoading(false);
    }
  };

  const drawerContent = (
    <div className={classes.drawerContent}>
      <Hidden xsDown implementation="css">
        <div className={classes.toolbar} />
      </Hidden>
      <List>
        <ListItem button selected={select === 'index'}>
          <ListItemText primary="后台首页" />
        </ListItem>
        <ListItem button selected={select === 'list'}>
          <ListItemText primary="文章列表" />
        </ListItem>
        <ListItem button selected={select === 'write'}>
          <ListItemText primary="撰写文章" />
        </ListItem>
        <ListItem button selected={select === 'comment'}>
          <ListItemText primary="评论管理" />
        </ListItem>
        <ListItem button selected={select === 'friends'}>
          <ListItemText primary="管理友链" />
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
              <Paper className={classes.loginPaper}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      placeholder="后台KEY"
                      fullWidth
                      type="password"
                      inputProps={{ maxLength: 30 }}
                      value={key}
                      onChange={(event) => {
                        setKey(event.target.value);
                      }}
                      onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                          handleLogin();
                        }
                      }}
                      disabled={loginLoading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" color="primary" fullWidth onClick={handleLogin} disabled={loginLoading}>
                      登陆
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </Grid>
        )}
      </main>
      <LogoutDialog
        open={showLogoutDialog}
        onClose={() => {
          toggleShowLogoutDialog(false);
        }}
        onSure={() => {
          toggleIsLogin(false);
          localStorage.removeItem('adminToken');
          toggleShowLogoutDialog(false);
        }}
      />
    </>
  );
}
