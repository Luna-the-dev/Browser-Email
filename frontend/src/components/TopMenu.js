import React, {useContext} from 'react';
import EmailContext from '../emailContext.js';
import Grid from '@material-ui/core/Grid';
import {fade, makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import Hidden from '@material-ui/core/Hidden';

/**
 * This component is a heavily modified version of the example shown here:
 * https://material-ui.com/components/app-bar/
 * #app-bar-with-a-primary-search-field
 */

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      display: 'block',
    },
  },
  search: {
    'position': 'relative',
    'borderRadius': theme.shape.borderRadius,
    'backgroundColor': fade(theme.palette.common.white, 0.15),
    '&:hover': {
      'backgroundColor': fade(theme.palette.common.white, 0.25),
    },
    'marginRight': theme.spacing(2),
    'marginLeft': 0,
    'width': '100%',
    [theme.breakpoints.up('md')]: {
      'marginLeft': theme.spacing(3),
      'width': '400px',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'flex',
  },
}));

/**
 * returns JSX element for the top menu bar
 * @return {Object} JSX
 */
export default function TopMenu() {
  const classes = useStyles();
  const {mailboxName, navDrawerOpen, setNavDrawerOpen, setSettingsDialogOpen,
    userSettings} = useContext(EmailContext);

  const displayMailboxName =
  mailboxName[0].toUpperCase() + mailboxName.substring(1);
  const userName = userSettings.name.split(' ');
  const firstName = userName[0];

  return (
    <Grid item xs={12} className={classes.grow}>
      <AppBar position="fixed">
        <Toolbar>
          <Hidden lgUp>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open NavBarPopout"
              onClick={() => setNavDrawerOpen(!navDrawerOpen)}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Typography className={classes.title} variant="h6" noWrap>
            {firstName} Mail - {displayMailboxName}
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{'aria-label': 'search'}}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="new email" color="inherit">
              <MailIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              color="inherit"
              onClick={() => setSettingsDialogOpen(true)}
            >
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </Grid>
  );
}
