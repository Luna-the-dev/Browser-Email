import React, {useContext, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import EmailContext from '../emailContext.js';
import {makeStyles} from '@material-ui/core/styles';
import {createNewMailbox} from '../APICalls.js';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr 1fr',
    paddingLeft: '16px',
  },
  addIcon: {
    paddingTop: '25px',
    paddingBottom: '32px',
    paddingRight: '32px',
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
export default function CreateMailbox() {
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
      createNewMailbox(newMailbox, mailboxesList, setMailboxesList);
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
    } else if (validCode === 'too short') {
      setError(true);
      setErrorText('Not enough characters');
    } else if (validCode === 'too long') {
      setError(true);
      setErrorText('Too many characters');
    } else if (validCode === 'duplicate') {
      setError(true);
      setErrorText('Name must be unique');
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

    if (mailbox.length < 2) return 'too short';

    if (mailbox.length > 32) return 'too long';

    if (!isAlphaNum(mailbox)) return 'invalid chars';

    if (mailbox.charAt(mailbox.length - 1) === ' ') return 'invalid end';

    const mailboxesListLC = [...mailboxesList];
    for (let i = 0; i < mailboxesListLC.length; i++) {
      mailboxesListLC[i] = mailboxesListLC[i].toLowerCase();
    }
    const newMailboxLC = mailbox.toLowerCase();
    if (mailboxesListLC.includes(newMailboxLC)) return 'duplicate';
    if (newMailboxLC === 'starred') return 'duplicate';

    return 'valid';
  }

  return (
    <form className={classes.form} onSubmit={(event) => handleSubmit(event)}>
      <AddIcon className={classes.addIcon}/>
      <TextField
        error={error}
        id='Create Mailbox'
        label='Create Mailbox'
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
