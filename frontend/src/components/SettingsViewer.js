import React, {useState, useContext, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import EmailContext from '../emailContext.js';
import Avatar from '@material-ui/core/Avatar';
import SaveIcon from '@material-ui/icons/Save';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import './css/SettingsViewer.css';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    zIndex: 900,
  },
  settingsViewerWrapper: {
    display: 'grid',
    gridTemplateColumns: 'auto, 1fr 3fr, auto',
    paddingRight: '100px',
    paddingLeft: '90px',
    paddingTop: '80px',
    minHeight: '300px',
    [theme.breakpoints.down('sm')]: {
      paddingRight: '60px',
      paddingLeft: '50px',
    },
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  editProfile: {
    marginLeft: 'auto',
    color: 'white',
    paddingRight: '0px',
  },
  moveToTrash: {
    marginLeft: 'auto',
    color: 'white',
    paddingRight: '0px',
  },
}));

/**
 * Parent JSX for the various email viewers
 * Note: The code for the email viewers were heavily influenced by the examples
 * at https://material-ui.com/components/dialogs/#full-screen-dialogs
 * @return {Object} JSX
 */
export default function EmailViewerMobile() {
  const {userSettings, setUserSettings, settingsDialogOpen,
    setSettingsDialogOpen} = useContext(EmailContext);
  const [width, setWidth] = useState(window.innerWidth);
  const [edit, setEdit] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [exitDialog, setExitDialog] = useState(false);

  // taken from https://blog.logrocket.com
  // developing-responsive-layouts-with-react-hooks/
  const breakpoint = 960;
  useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowResize);

    // Return a function from the effect that removes the event listener
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  const classes = useStyles();

  /**
   * handles the event for closing the email viewer
   */
  function handleExit() {
    if (edit && newName !== '' && userSettings.name !== newName) {
      setExitDialog(true);
    } else {
      setSettingsDialogOpen(false);
    }
  };

  /**
   * Handles the event when the user submits a new mailbox
   * @param {String} event the string that the user has currently typed in
   */
  function handleSave(event) {
    if (event !== undefined) {
      event.preventDefault();
    }
    setExitDialog(false);
    if (newName.length !== 0 && error === false) {
      const tempSettings = userSettings;
      tempSettings.name = newName.toLowerCase()
          .split(' ')
          .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ');
      setUserSettings(tempSettings);
      setEdit(false);
      setSettingsDialogOpen(false);
    } else {
      setEdit(false);
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
   * @param {String} name the new name that the user is typing
   * @return {String} String with the error or valid code
   */
  function isValid(name) {
    if (name.length === 0) return 'valid';

    if (name.length < 2) return 'too short';

    if (name.length > 32) return 'too long';

    if (!isAlphaNum(name)) return 'invalid chars';

    if (name.charAt(name.length - 1) === ' ') return 'invalid end';

    return 'valid';
  }

  return (
    <Dialog
      fullScreen={(width < breakpoint) ? true : false}
      open={settingsDialogOpen}
      onClose={handleExit}
    >
      <Dialog
        open={exitDialog}
        onClose={() => setExitDialog(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Would you like to save your changes before exiting?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleSave()} color='primary' autoFocus>
            Yes
          </Button>
          <Button onClick={() => {
            setEdit(false);
            setSettingsDialogOpen(false);
            setExitDialog(false);
          }} color='primary'>
            No
          </Button>
        </DialogActions>
      </Dialog>
      <AppBar className={classes.appBar}>
        <Toolbar style={{display: 'flex'}}>
          <IconButton
            edge='start'
            color='inherit'
            onClick={() => handleExit()}
            aria-label='close'
          >
            <CloseIcon />
          </IconButton>
          {edit ?
            <IconButton
              aria-label='save'
              className={classes.moveToTrash}
              onClick={() => handleSave()}
            >
              <SaveIcon />
            </IconButton> :
            <IconButton
              aria-label='edit'
              className={classes.editProfile}
              onClick={() => setEdit(true)}
            >
              <EditIcon />
            </IconButton>
          }
        </Toolbar>
      </AppBar>
      {/** ------------------------------------------ */}
      <div className={classes.settingsViewerWrapper}>
        <div id='settings-avatar'>
          <Avatar
            alt={userSettings.name}
            src='foo'
            className={classes.avatar}
          />
        </div>
        {edit ?
          <form onSubmit={(event) => handleSave(event)}>
            <TextField
              error={error}
              id='Edit Name'
              label='Edit Name'
              margin='dense'
              value={newName}
              helperText={errorText}
              onChange={(event) => {
                setNewName(event.target.value);
                onChange(event);
              }}
            />
          </form> :
          <Typography variant='h6' id='settings-subject'>
            {userSettings.name}
          </Typography>
        }
        {edit ?
          <div id='settings-email' /> :
          <Typography variant='body2' id='settings-email'>
            {'< ' + userSettings.email + ' >'}
          </Typography>
        }
      </div>
    </Dialog>
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
