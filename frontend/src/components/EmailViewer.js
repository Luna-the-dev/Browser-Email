import React, {useContext, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ReplyIcon from '@material-ui/icons/Reply';
import StarIcon from '@material-ui/icons/Star';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import EmailContext from '../emailContext.js';
import Avatar from '@material-ui/core/Avatar';
import timeStamp from '../timestamp.js';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import DeleteIcon from '@material-ui/icons/Delete';
import {setRead, setStarred, moveEmail} from '../APICalls.js';
import './css/EmailViewer.css';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    zIndex: 900,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  starred: {
    color: '#B78727',
    width: '30px',
    height: '30px',
  },
  notStarred: {
    width: '30px',
    height: '30px',
  },
  markAsUnread: {
    color: 'white',
    marginLeft: 'auto',
  },
  moveMailbox: {
    color: 'white',
  },
  moveToTrash: {
    color: 'white',
  },
}));

/**
 * Parent JSX for the various email viewers
 * Note: The code for the email viewers were heavily influenced by the examples
 * at https://material-ui.com/components/dialogs/#full-screen-dialogs
 * @return {Object} JSX
 */
export default function EmailViewerMobile() {
  const {mailboxName, setMailboxName, setMailbox, setEmailDrawerOpen,
    currEmail, setCurrEmail, mailboxesListUnread, setMailboxesListUnread,
    mailboxesList, setMailboxesList, currEmailIndex, mailbox, setSelectedIndex,
  } = useContext(EmailContext);
  const [anchorEl, setAnchorEl] = useState(null);
  let didEmailGetMoved = false;
  const classes = useStyles();

  const mailboxesMoveValid = [...mailboxesList];
  console.log(mailboxesMoveValid);
  let index = mailboxesMoveValid.indexOf(mailboxName);
  mailboxesMoveValid.splice(index, 1);
  index = mailboxesMoveValid.indexOf('sent');
  mailboxesMoveValid.splice(index, 1);
  index = mailboxesMoveValid.indexOf('drafts');
  mailboxesMoveValid.splice(index, 1);
  console.log(mailboxesMoveValid);

  /**
   * handles the event for closing the email viewer
   */
  function handleClose() {
    setEmailDrawerOpen(false);
  };

  const handleMoveEmailClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * handles the event of the move email button closing
   * @param {String} newMailboxName mailbox that the email is moving into
   * @param {Boolean} trash true if user clicked move to trash button
   */
  function handleMoveEmailClose(newMailboxName, trash) {
    if (newMailboxName === undefined) {
      setAnchorEl(null);
      return;
    }

    // moving the email into the new mailbox
    moveEmail(currEmail.id, newMailboxName);

    // updating the old mailbox state hook locally
    const tempMailbox = [...mailbox];
    tempMailbox.splice(currEmailIndex, 1);
    if (tempMailbox.length === 0) {
      // triggered if only the last email was moved out of the mailbox
      const tempMailboxesList = [...mailboxesList];
      const i = mailboxesList.indexOf(currEmail.mailbox);
      tempMailboxesList.splice(i, 1);
      setMailboxesList(tempMailboxesList);
      setSelectedIndex(0);
      setMailboxName('inbox');
    } else {
      setMailbox(tempMailbox);
    }

    if (trash) {
      handleClose();
    } else {
      // setting flag for email getting moved (used in handleEventStarred)
      didEmailGetMoved = true;
      currEmail.mailbox = newMailboxName;
      setAnchorEl(null);
    }
  };

  /**
   * handles the onClick of when a user stars/unstars an email
   * @param {String} id id of the email to set the starred
   * @param {Boolean} starred setting the email to be starred/unstarred
   * @param {Boolean} read true is the eail has been read, false otherwise
   */
  function handleEventStarred(id, starred, read) {
    setStarred(id, starred);
    setCurrEmail((prevState) => ({
      ...prevState,
      starred: starred,
    }));

    // starring the email in the mailbox viewer unless the email got moved b4
    if (didEmailGetMoved === false) {
      const updatedMailbox = JSON.parse(JSON.stringify(mailbox));
      updatedMailbox[currEmailIndex].starred = starred;
      setMailbox(updatedMailbox);
    }

    // if email is unread, adjust the starred mailbox
    if (read === false) {
      adjustUnreadStarred(starred, mailboxesListUnread, setMailboxesListUnread);
    }
  };

  /**
   * updates state hook for unread emails if user marks current email as unread
   */
  async function markAsUnread() {
    // setting email as unread in the server
    await setRead(currEmail.id, false);

    if (mailbox.currEmailIndex !== undefined) {
      // updating the email in the mailbox to be unread
      const tempMailbox = [...mailbox];
      tempMailbox[currEmailIndex].read = false;
      setMailbox(tempMailbox);
    }

    // updating the array of unread emails
    const i = mailboxesList.indexOf(currEmail.mailbox);
    const tempArr = [...mailboxesListUnread];
    tempArr[i] += 1;
    if (currEmail.starred) {
      tempArr[tempArr.length - 1] += 1;
    }
    setMailboxesListUnread(tempArr);
    handleClose();
  }

  return (
    <div>
      <AppBar className={classes.appBar}>
        <Toolbar style={{display: 'flex', paddingRight: '0px'}}>
          <IconButton
            edge='start'
            color='inherit'
            onClick={() => handleClose()}
            aria-label='close'
          >
            <CloseIcon />
          </IconButton>
          <Typography variant='body1' id='email-mailbox-name'>
            <Box fontWeight={400} fontSize={24}>
              {currEmail.mailbox.toLowerCase()
                  .split(' ')
                  .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                  .join(' ')
              }
            </Box>
          </Typography>
          <IconButton
            aria-label='mark as unread'
            className={classes.markAsUnread}
            onClick={() => markAsUnread()}
          >
            <MailOutlineIcon />
          </IconButton>
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            className={classes.moveMailbox}
            onClick={handleMoveEmailClick}
          >
            <MoveToInboxIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => handleMoveEmailClose()}
          >
            {mailboxesMoveValid.map((mailboxName) => (
              <MenuItem
                key={mailboxName}
                onClick={() => handleMoveEmailClose(mailboxName)}
              >
                {mailboxName.toLowerCase()
                    .split(' ')
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ')
                }
              </MenuItem>
            ))}
          </Menu>
          <IconButton
            aria-label='move to trash'
            className={classes.moveToTrash}
            onClick={() => handleMoveEmailClose('trash', true)}
          >
            <DeleteIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className='email-viewer-wrapper'>
        <Typography variant='h6' id='email-subject'>
          {currEmail.subject}
        </Typography>
        <div id='email-avatar'>
          {mailboxName == 'sent' ? (
            <Avatar
              alt={currEmail.to.name}
              src={currEmail.to.avatar}
              className={classes.avatar}
            />
          ) : (
            <Avatar
              alt={currEmail.from.name}
              src={currEmail.from.avatar}
              className={classes.avatar}
            />
          )}
        </div>
        <Typography variant='subtitle1' id='email-from-name'>
          {currEmail.from.name} {' | '} {timeStamp(currEmail.received)}
        </Typography>
        <Typography variant='body2' id='email-from-email'>
          {'< ' + currEmail.from.email + ' >'}
        </Typography>
        <IconButton
          aria-label='starred'
          id='email-starred'
          onClick={() => handleEventStarred(
              currEmail.id,
              !currEmail.starred,
              currEmail.read,
          )}>
          {currEmail.starred ? (
              <StarIcon className={classes.starred}/>
            ) : (
              <StarBorderIcon className={classes.notStarred} />
            )}
        </IconButton>
        <IconButton aria-label='reply' id='email-reply'>
          <ReplyIcon />
        </IconButton>
        <Typography variant='body1' id='email-content'>
          {currEmail.content}
        </Typography>
      </div>
      <Divider />
    </div>
  );
}
