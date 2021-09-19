import {
  AccountCircleOutlined,
  ApartmentOutlined,
  ArchiveOutlined,
  AssignmentOutlined,
  BookOutlined,
  CodeOutlined,
  ExpandLess,
  ExpandMore,
  HomeOutlined,
  LanguageOutlined,
  LocalOfferOutlined,
  Menu,
  NaturePeopleOutlined,
  PeopleAltOutlined,
  TrainOutlined,
  VideogameAssetOutlined,
} from '@material-ui/icons';
import {
  AppBar,
  Collapse,
  Divider,
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link as MuiLink,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 170;
const useStyles = makeStyles((theme) => ({
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
    marginTop: theme.spacing(10),
    margin: theme.spacing(3),
  },
  footer: {
    margin: theme.spacing(1),
  },
}));

interface LayoutProps {
  children: ReactNode;
  title: string;
  select?: 'index' | 'code' | 'study' | 'website' | 'game' | 'life' | 'about' | 'friends' | 'tags';
}

const Layout: React.FC<LayoutProps> = ({ children, title, select }) => {
  const classes = useStyles();

  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const [isDrawerOpen, toggleIsDrawerOpen] = useState<boolean>(false);

  const DrawerContent: React.FC = () => {
    const [showArchive, toggleShowArchive] = useState<boolean>(
      ['code', 'study', 'website', 'game', 'life'].includes(select || '')
    );
    return (
      <div className={classes.drawerContent}>
        <Hidden xsDown implementation="css">
          <div className={classes.toolbar} />
        </Hidden>
        <List>
          <Link href="/" passHref>
            <ListItem button selected={select === 'index'}>
              <ListItemIcon>
                <HomeOutlined />
              </ListItemIcon>
              <ListItemText primary="主页" />
            </ListItem>
          </Link>
          <Link href="/about" passHref>
            <ListItem button selected={select === 'about'}>
              <ListItemIcon>
                <AccountCircleOutlined />
              </ListItemIcon>
              <ListItemText primary="介绍" />
            </ListItem>
          </Link>
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
            <Link href="/archive/code" passHref>
              <ListItem button className={classes.nestedList} selected={select === 'code'}>
                <ListItemIcon>
                  <CodeOutlined />
                </ListItemIcon>
                <ListItemText primary="编程" />
              </ListItem>
            </Link>
            <Link href="/archive/study" passHref>
              <ListItem button className={classes.nestedList} selected={select === 'study'}>
                <ListItemIcon>
                  <BookOutlined />
                </ListItemIcon>
                <ListItemText primary="学习" />
              </ListItem>
            </Link>
            <Link href="/archive/website" passHref>
              <ListItem button className={classes.nestedList} selected={select === 'website'}>
                <ListItemIcon>
                  <LanguageOutlined />
                </ListItemIcon>
                <ListItemText primary="建站" />
              </ListItem>
            </Link>
            <Link href="/archive/game" passHref>
              <ListItem button className={classes.nestedList} selected={select === 'game'}>
                <ListItemIcon>
                  <VideogameAssetOutlined />
                </ListItemIcon>
                <ListItemText primary="游戏" />
              </ListItem>
            </Link>
            <Link href="/archive/life" passHref>
              <ListItem button className={classes.nestedList} selected={select === 'life'}>
                <ListItemIcon>
                  <NaturePeopleOutlined />
                </ListItemIcon>
                <ListItemText primary="生活" />
              </ListItem>
            </Link>
          </Collapse>
          <Link href="/friends" passHref>
            <ListItem button selected={select === 'friends'}>
              <ListItemIcon>
                <PeopleAltOutlined />
              </ListItemIcon>
              <ListItemText primary="友链" />
            </ListItem>
          </Link>
          <Link href="/tags" passHref>
            <ListItem button selected={select === 'tags'}>
              <ListItemIcon>
                <LocalOfferOutlined />
              </ListItemIcon>
              <ListItemText primary="标签" />
            </ListItem>
          </Link>
          <ListItem
            button
            onClick={() => {
              window.open('https://jsun969.github.io');
            }}
          >
            <ListItemIcon>
              <ApartmentOutlined />
            </ListItemIcon>
            <ListItemText primary="小屋" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              window.open('https://msg.jsun.limecho.net');
            }}
          >
            <ListItemIcon>
              <AssignmentOutlined />
            </ListItemIcon>
            <ListItemText primary="留言" />
          </ListItem>
          <ListItem
            onClick={() => {
              window.open('https://travellings.link');
            }}
            button
          >
            <ListItemIcon>
              <TrainOutlined />
            </ListItemIcon>
            <ListItemText primary="开往" />
          </ListItem>
        </List>
      </div>
    );
  };

  return (
    <>
      <header>
        <AppBar className={classes.appBar} position="fixed">
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
            {/* <IconButton edge="end" color="inherit">
              <Search />
            </IconButton> */}
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
              <DrawerContent />
            </SwipeableDrawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer open variant="permanent" className={classes.drawer}>
              <DrawerContent />
            </Drawer>
          </Hidden>
        </nav>
      </header>

      <main className={classes.main}>
        <div className={classes.content}>{children}</div>
        <Divider />
        <footer className={classes.footer}>
          <Typography variant="body2" color="textSecondary" align="center">
            Copyright &copy; 2020-{dayjs().year()} 荆棘Justin 版权所有
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            Powered by{' '}
            <MuiLink color="inherit" href="https://github.com/jsun969/JBlog">
              JBlog
            </MuiLink>
          </Typography>
        </footer>
      </main>
    </>
  );
};

export default Layout;
