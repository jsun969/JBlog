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
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Link,
  Hidden,
  Box,
} from '@material-ui/core';
import {
  Menu,
  Search,
  HomeOutlined,
  ArchiveOutlined,
  AccountCircleOutlined,
  PeopleAltOutlined,
  ApartmentOutlined,
  AssignmentOutlined,
  DirectionsRunOutlined,
  ExpandLess,
  ExpandMore,
  CodeOutlined,
  BookOutlined,
  QueryBuilderOutlined,
  LanguageOutlined,
  VideogameAssetOutlined,
  LocalOfferOutlined,
} from '@material-ui/icons';
import { makeStyles, Theme } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import Image from 'next/image';

const drawerWidth = 170;
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
  footer: {
    margin: theme.spacing(1),
  },
}));

export default function Layout({
  children,
  title,
  select,
}: {
  children: ReactNode;
  title: string;
  select: 'index' | 'code' | 'study' | 'status' | 'website' | 'game' | 'about' | 'friends' | 'tags';
}) {
  const classes = useStyles();

  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const [isDrawerOpen, toggleIsDrawerOpen] = useState<boolean>(false);
  const [showArchive, toggleShowArchive] = useState<boolean>(['code', 'study', 'status', 'website', 'game'].includes(select));

  const drawerContent = (
    <div className={classes.drawerContent}>
      <Hidden xsDown implementation="css">
        <div className={classes.toolbar} />
      </Hidden>
      <List>
        <ListItem button selected={select === 'index'}>
          <ListItemIcon>
            <HomeOutlined />
          </ListItemIcon>
          <ListItemText primary="主页" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            toggleShowArchive(!showArchive);
          }}
        >
          <ListItemIcon>
            <ArchiveOutlined />
          </ListItemIcon>
          <ListItemText primary="归档" />
          {showArchive ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={showArchive}>
          <ListItem button className={classes.nestedList} selected={select === 'code'}>
            <ListItemIcon>
              <CodeOutlined />
            </ListItemIcon>
            <ListItemText primary="编程" />
          </ListItem>
          <ListItem button className={classes.nestedList} selected={select === 'study'}>
            <ListItemIcon>
              <BookOutlined />
            </ListItemIcon>
            <ListItemText primary="学习" />
          </ListItem>
          <ListItem button className={classes.nestedList} selected={select === 'status'}>
            <ListItemIcon>
              <QueryBuilderOutlined />
            </ListItemIcon>
            <ListItemText primary="状态" />
          </ListItem>
          <ListItem button className={classes.nestedList} selected={select === 'website'}>
            <ListItemIcon>
              <LanguageOutlined />
            </ListItemIcon>
            <ListItemText primary="建站" />
          </ListItem>
          <ListItem button className={classes.nestedList} selected={select === 'game'}>
            <ListItemIcon>
              <VideogameAssetOutlined />
            </ListItemIcon>
            <ListItemText primary="游戏" />
          </ListItem>
        </Collapse>
        <ListItem button selected={select === 'about'}>
          <ListItemIcon>
            <AccountCircleOutlined />
          </ListItemIcon>
          <ListItemText primary="介绍" />
        </ListItem>
        <ListItem button selected={select === 'friends'}>
          <ListItemIcon>
            <PeopleAltOutlined />
          </ListItemIcon>
          <ListItemText primary="友链" />
        </ListItem>
        <ListItem button selected={select === 'tags'}>
          <ListItemIcon>
            <LocalOfferOutlined />
          </ListItemIcon>
          <ListItemText primary="标签" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <ApartmentOutlined />
          </ListItemIcon>
          <ListItemText primary="小屋" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <AssignmentOutlined />
          </ListItemIcon>
          <ListItemText primary="留言" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <DirectionsRunOutlined />
          </ListItemIcon>
          <ListItemText primary="开往" />
        </ListItem>
      </List>
      <Divider />
      <Box m={2} style={{ display: 'block' }}>
        <Typography variant="caption" color="textSecondary">
          赞助商
        </Typography>
        <a href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral" target="_blank" rel="noreferrer">
          <Image src="/upyun.png" alt="upyun" width="128" height="66" />
        </a>
      </Box>
    </div>
  );

  return (
    <>
      <header>
        <AppBar position="sticky" className={classes.appBar}>
          <Toolbar>
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
            <Typography variant="h6" className={classes.title}>
              {title}
            </Typography>
            <IconButton edge="end" color="inherit">
              <Search />
            </IconButton>
          </Toolbar>
        </AppBar>
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
      </header>

      <main className={classes.main}>
        <Typography paragraph className={classes.content}>
          {children}
        </Typography>
        <Divider />
        <footer className={classes.footer}>
          <Typography variant="body2" color="textSecondary" align="center">
            Copyright &copy; 2020-{dayjs().year()} 荆棘Justin 版权所有
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            Powered by{' '}
            <Link
              color="inherit"
              onClick={() => {
                window.open('https://github.com/jsun969/JBlog');
              }}
            >
              JBlog
            </Link>
          </Typography>
        </footer>
      </main>
    </>
  );
}
