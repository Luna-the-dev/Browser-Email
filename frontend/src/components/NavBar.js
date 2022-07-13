import React, {useContext} from 'react';
import InboxIcon from '@material-ui/icons/Inbox';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import DraftsIcon from '@material-ui/icons/Drafts';
import StarIcon from '@material-ui/icons/Star';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Typography from '@material-ui/core/Typography';
import EmailContext from '../emailContext.js';
import {makeStyles} from '@material-ui/core/styles';
import CreateMailbox from './CreateMailbox.js';
import DeleteMailbox from './DeleteMailbox.js';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles((theme) => ({
  mailboxName: {
    width: '180px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [theme.breakpoints.up('lg')]: {
      width: '160px',
    },
  },
  listItem: {
    height: '50px',
  },
  settings: {
    paddingTop: '20px',
    paddingBottom: '25px',
  },
  settingsText: {
    paddingLeft: '1px',
  },
}));

/**
 * Returns side navigation bar. This function was heavily influenced by:
 * https://material-ui.com/components/lists/#selected-listitem
 * @return {object} JSX
 */
export default function NavBar() {
  const {setMailboxName, mailboxesList, mailboxesListUnread, selectedIndex,
    setSettingsDialogOpen, setSelectedIndex} = useContext(EmailContext);

  const starredIndex = mailboxesListUnread.length - 1;
  const userMailboxes = [...mailboxesList];
  userMailboxes.splice(0, 4);

  const handleListItemClick = (i, mailboxName) => {
    setSelectedIndex(i);
    setMailboxName(mailboxName);
  };

  const settingsKey = mailboxesListUnread.length;

  const classes = useStyles();

  return (
    <div>
      <List component='nav' aria-label='navbar-inbox'>
        <ListItem
          button
          key={0}
          selected={selectedIndex === 0}
          className={classes.listItem}
          onClick={() => handleListItemClick(0, 'inbox')}
        >
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary='Inbox' />
          <ListItemText
            primary={
              (mailboxesListUnread[0] !== 0) ?
              mailboxesListUnread[0] :
              ''
            }
            style={{textAlign: 'right'}}
          />
        </ListItem>
      </List>
      <Divider />
      <List component='nav' aria-label='navbar-built-in-mailboxes'>
        <ListItem
          button
          key={1}
          selected={selectedIndex === 1}
          className={classes.listItem}
          onClick={() => handleListItemClick(1, 'starred')}
        >
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary='Starred' />
          <ListItemText
            primary={
              (mailboxesListUnread[starredIndex] !== 0) ?
              mailboxesListUnread[starredIndex] :
              ''
            }
            style={{textAlign: 'right'}}
          />
        </ListItem>
        <ListItem
          button
          key={2}
          selected={selectedIndex === 2}
          className={classes.listItem}
          onClick={() => handleListItemClick(2, 'sent')}
        >
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary='Sent' />
          <ListItemText
            primary={
              (mailboxesListUnread[1] !== 0) ?
              mailboxesListUnread[1] :
              ''
            }
            style={{textAlign: 'right'}}
          />
        </ListItem>
        <ListItem
          button
          key={3}
          selected={selectedIndex === 3}
          className={classes.listItem}
          onClick={() => handleListItemClick(3, 'drafts')}
        >
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary='Drafts' />
          <ListItemText
            primary={
              (mailboxesListUnread[2] !== 0) ?
              mailboxesListUnread[2] :
              ''
            }
            style={{textAlign: 'right'}}
          />
        </ListItem>
        <ListItem
          button
          key={4}
          selected={selectedIndex === 4}
          className={classes.listItem}
          onClick={() => handleListItemClick(4, 'trash')}
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary='Trash' />
          <ListItemText
            primary={
              (mailboxesListUnread[3] !== 0) ?
              mailboxesListUnread[3] :
              ''
            }
            style={{textAlign: 'right'}}
          />
        </ListItem>
      </List>
      <Divider />
      <List>
        {userMailboxes.map((mailboxName, i) => (
          <ListItem
            button
            key={i + 5}
            selected={selectedIndex === (i + 5)}
            className={classes.listItem}
            onClick={() => handleListItemClick((i + 5), mailboxName)}
          >
            <ListItemIcon>
              <ArrowForwardIcon />
            </ListItemIcon>
            <Typography className={classes.mailboxName} >
              {mailboxName.toLowerCase()
                  .split(' ')
                  .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                  .join(' ')
              }
            </Typography>
            <ListItemText
              primary={
                (mailboxesListUnread[i + 4] !== 0) ?
                mailboxesListUnread[i + 4] :
                ''
              }
              style={{textAlign: 'right'}}
            />
          </ListItem>
        ))}
        <Divider />
        <CreateMailbox />
        <DeleteMailbox />
        <Divider />
        <ListItem
          button
          key={settingsKey}
          className={classes.settings}
          onClick={() => setSettingsDialogOpen(true)}
        >
          <ListItemIcon className={classes.settingsText} >
            <SettingsIcon/>
          </ListItemIcon>
          <ListItemText primary='Settings' />
        </ListItem>
      </List>
    </div>
  );
}
