import { ReactNode, useState } from 'react';
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
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { makeStyles, Theme } from '@material-ui/core/styles';

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
  content: {
    margin: theme.spacing(3),
  },
}));

export default function Layout({
  children,
  select = 'write',
  isLogin = false,
}: {
  children: ReactNode;
  select?: 'write' | 'list' | 'friends' | 'about';
  isLogin?: boolean;
}) {
  const classes = useStyles();

  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const [isDrawerOpen, toggleIsDrawerOpen] = useState<boolean>(false);

  const drawerContent = (
    <div className={classes.drawerContent}>
      <Hidden xsDown implementation="css">
        <div className={classes.toolbar} />
      </Hidden>
      <List>
        <ListItem button selected={select === 'write'}>
          <ListItemText primary="撰写文章" />
        </ListItem>
        <ListItem button selected={select === 'list'}>
          <ListItemText primary="文章列表" />
        </ListItem>
        <ListItem button selected={select === 'friends'}>
          <ListItemText primary="添加友链" />
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
        <Typography paragraph className={classes.content}>
          {children}
        </Typography>
      </main>
    </>
  );
}
