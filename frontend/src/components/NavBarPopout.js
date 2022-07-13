import React, {useContext} from 'react';
import EmailContext from '../emailContext.js';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import NavBar from './NavBar.js';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    paddingTop: '20px',
    paddingLeft: '20px',
    paddingBottom: '10px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

/**
 * this component displays the side bar popout when the screen gets small
 * @return {Object} JSX for navbar popout
 */
export default function NavbarPopout() {
  const {navDrawerOpen, setNavDrawerOpen, userSettings, mailboxName} =
    useContext(EmailContext);
  const displayMailboxName =
    mailboxName[0].toUpperCase() + mailboxName.substring(1);
  const userName = userSettings.name.split(' ');
  const firstName = userName[0];
  const classes = useStyles();

  return (
    <Drawer
      anchor={'left'}
      open={navDrawerOpen}
      onClose={() => setNavDrawerOpen(false)}
      style={{zIndex: 1100}}
    >
      <Typography variant="h6" noWrap className={classes.title}>
        {firstName} Mail - {displayMailboxName}
      </Typography>
      <div style={{width: 325}}>
        <NavBar />
      </div>
    </Drawer>
  );
}
