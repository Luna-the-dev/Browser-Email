import React, {useContext, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import EmailContext from '../emailContext.js';
import {makeStyles} from '@material-ui/core/styles';
import {deleteMailbox} from '../APICalls.js';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr 1fr',
    paddingLeft: '16px',
  },
  deleteIcon: {
    paddingTop: '25px',
    paddingBottom: '40px',
    paddingRight: '30px',
    paddingLeft: '2px',
    color: 'gray',
  },
  textField: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

/**
 * Returns side navigation bar
 * @return {object} JSX
 */
export default function DeleteMailbox() {
  const {mailboxesList, setMailboxesList} = useContext(EmailContext);
  const [newMailbox, setNewMailbox] = useState('');
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const classes = useStyles();

  /**
   * Chandles the event when the user submits a new mailbox
   * @param {String} event the string that the user has currently typed in
   */
  function handleSubmit(event) {
    event.preventDefault();
    if (newMailbox.length !== 0 && error === false) {
      deleteMailbox(newMailbox, mailboxesList, setMailboxesList);
      setNewMailbox('');
      return;
    } else {
      return;
    }
  }

  /**
   * Checks what the user is typing and throws an error if invalid
   * @param {String} event the string that the user has currently typed in
   */
  function onChange(event) {
    const validCode = isValid(event.target.value);

    if (validCode === 'valid') {
      setError(false);
      setErrorText('');
    } else if (validCode === 'not duplicate') {
      setError(true);
      setErrorText('Name must match a mailbox');
    } else if (validCode === 'invalid mailbox') {
      setError(true);
      setErrorText('You cannot delete this mailbox');
    } else if (validCode === 'invalid chars') {
      setError(true);
      setErrorText('Only alphanumeric characters');
    } else if (validCode === 'invalid end') {
      setError(true);
      setErrorText('Cannot end with a space');
    }
    return;
  }

  /**
   * Checks the validity of the new mailbox and returns an error/valid string
   * @param {String} mailbox Name of the new mailbox that the user is typing
   * @return {String} String with the error or valid code
   */
  function isValid(mailbox) {
    if (mailbox.length === 0) return 'valid';

    if (!isAlphaNum(mailbox)) return 'invalid chars';

    if (mailbox.charAt(mailbox.length - 1) === ' ') return 'invalid end';

    mailbox.toLowerCase();
    if (
      mailbox === 'inbox' ||
      mailbox === 'starred' ||
      mailbox === 'sent' ||
      mailbox === 'drafts' ||
      mailbox === 'trash'
    ) return 'invalid mailbox';

    const mailboxesListLC = [...mailboxesList];
    for (let i = 0; i < mailboxesListLC.length; i++) {
      mailboxesListLC[i] = mailboxesListLC[i].toLowerCase();
    }
    const newMailboxLC = mailbox;
    if (mailboxesListLC.includes(newMailboxLC)) return 'valid';

    return 'not duplicate';
  }

  return (
    <form className={classes.form} onSubmit={(event) => handleSubmit(event)}>
      <DeleteSweepIcon className={classes.deleteIcon}/>
      <TextField
        error={error}
        id='Delete Mailbox'
        label='Delete Mailbox'
        className={classes.textField}
        margin='dense'
        value={newMailbox}
        helperText={errorText}
        onChange={(event) => {
          setNewMailbox(event.target.value);
          onChange(event);
        }}
      />
    </form>
  );
}

/**
 * Checks to see if the string is alphanumeric
 * taken from: https://stackoverflow.com/a/25352300
 * @param {String} str string that is being checked
 * @return {Boolean} returns true if string only contains alphanumeric chars
 */
function isAlphaNum(str) {
  let code;
  for (let i = 0; i < str.length; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123) && // lower alpha (a-z)
        !(code == 32)) { // space ( )
      return false;
    }
  }
  return true;
};
