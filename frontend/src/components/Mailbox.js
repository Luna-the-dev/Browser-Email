import React, {useContext, useState} from 'react';
import EmailContext from '../emailContext.js';
import EmailPaper from './Email.js';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import timeStamp from '../timestamp.js';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import Hidden from '@material-ui/core/Hidden';
import {setStarred, getEmail, setRead} from '../APICalls.js';
import {adjustUnreadStarred} from '../adjustUnread.js';
import {makeStyles} from '@material-ui/core/styles';
import './css/Mailbox.css';

const useStyles = makeStyles((theme) => ({
  starred: {
    color: '#B78727',
    width: '30px',
    height: '30px',
  },
  notStarred: {
    width: '30px',
    height: '30px',
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  mailboxName: {
    padding: '10px',
  },
}));

/**
 * JSX component of the current mailbox
 * @return {Object} JSX
 */
function Mailbox() {
  const {mailbox, setMailbox, mailboxName, isMailboxEmpty, mailboxesList,
    mailboxesListUnread, setMailboxesListUnread, setCurrEmail, emailDrawerOpen,
    setEmailDrawerOpen, setCurrEmailIndex} = useContext(EmailContext);

  const [emailHoverId, setEmailHoverId] = useState('');

  /**
   * handles the onClick of when a user stars/unstars an email
   * @param {Object} event event of the onclick
   * @param {String} id id of the email to set the starred
   * @param {Boolean} starred setting the email to be starred/unstarred
   * @param {Number} i index of the email that is being updated
   * @param {Boolean} read true is the eail has been read, false otherwise
   */
  function handleEventStarred(event, id, starred, i, read) {
    event.stopPropagation();
    setStarred(id, starred);
    const updatedMailbox = JSON.parse(JSON.stringify(mailbox));
    updatedMailbox[i].starred = starred;
    setMailbox(updatedMailbox);
    // if email is unread, adjust the starred mailbox
    if (read === false) {
      adjustUnreadStarred(starred, mailboxesListUnread, setMailboxesListUnread);
    }
  };

  /**
   * handles the onClick for when a user selects an email
   * @param {String} id id of the email being clicked on
   * @param {Boolean} read value of whether the email is read
   * @param {Boolean} starred value of whether the email is starred
   * @param {Number} index index of the email in the mailbox
   */
  function handleEventEmail(id, read, starred, index) {
    if (read === false) {
      markAsRead(id, starred, index);
    }
    getEmail(id, setCurrEmail, mailboxName);
    setCurrEmailIndex(index);
    setEmailDrawerOpen(true);
  }

  /**
   * updates state hook for unread emails if user marks current email as unread
   * @param {String} id the id of the email that is being set as read
   * @param {Boolean} starred value of whether the email is starred
   * @param {Number} index index of the email in the mailbox
   */
  async function markAsRead(id, starred, index) {
    // setting email as read in the server
    await setRead(id, true);

    // updating the email in the mailbox to be read
    const tempMailbox = [...mailbox];
    tempMailbox[index].read = true;
    setMailbox(tempMailbox);

    // updating the array of # of unread emails
    const i = mailboxesList.indexOf(mailboxName);
    const tempArr = [...mailboxesListUnread];
    tempArr[i] -= 1;
    if (starred) {
      tempArr[tempArr.length - 1] -= 1;
    }
    setMailboxesListUnread(tempArr);
  }

  const classes = useStyles();
  const displayMailboxName =
    mailboxName[0].toUpperCase() + mailboxName.substring(1);

  if (isMailboxEmpty) {
    return (
      <Grid item md={emailDrawerOpen ? 5 : 12} lg={10}>
        <div id='empty-mailbox'>
          <Typography variant="h5"> {
            'This mailbox is empty. Please select ' +
            'another mailbox or move an email into this one.'
          }
          </Typography>
        </div>
      </Grid>
    );
  }

  return (
    <Grid item md={emailDrawerOpen ? 5 : 12} lg={10}>
      <div style={{height: '55px'}}/>
      <Hidden mdUp>
        <Paper className={classes.mailboxName} elevation={3}>
          <Typography variant="h5">{displayMailboxName}</Typography>
        </Paper>
      </Hidden>
      {mailbox.map((email, i) => (
        <EmailPaper
          className={email.read ? 'wrapper-read' : 'wrapper-unread'}
          key={email.id}
          elevation={emailHoverId === email.id ? 10 : 1}
          mt={0.5}
          onClick={() => handleEventEmail(
              email.id,
              email.read,
              email.starred,
              i,
          )}
          onMouseOver={() => setEmailHoverId(email.id)}
          onMouseOut={() => setEmailHoverId('')}
        >
          <div id='avatar'>
            {mailboxName == 'sent' ? (
              <Avatar
                alt={email.to.name}
                src={email.to.avatar}
                className={classes.avatar}
              />
            ) : (
              <Avatar
                alt={email.from.name}
                src={email.from.avatar}
                className={classes.avatar}
              />
            )}
          </div>
          <div id={email.read ? 'name-read' : 'name-unread'}>
            {email.from.name}
          </div>
          <div id={email.read ? 'subject-read' : 'subject-unread'}>
            {email.subject}
          </div>
          <div id={email.read ? 'content-read' : 'content-unread'}>
            {email.content}
          </div>
          <div id='date'>{timeStamp(email.received)}</div>
          <div id='starred'>
            <IconButton
              aria-label='starred'
              onClick={(event) =>
                handleEventStarred(event, email.id,
                    !email.starred, i, email.read)
              }
            >
              {email.starred ? (
                <StarIcon className={classes.starred}/>
              ) : (
                <StarBorderIcon className={classes.notStarred} />
              )}
            </IconButton>
          </div>
        </EmailPaper>
      ))}
    </Grid>
  );
}

export default Mailbox;
