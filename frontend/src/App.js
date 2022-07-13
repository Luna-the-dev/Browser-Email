import React, {useEffect, useState} from 'react';
import EmailContext from './emailContext.js';
import Grid from '@material-ui/core/Grid';
import Mailbox from './components/Mailbox.js';
import TopMenu from './components/TopMenu.js';
import NavBarStatic from './components/NavBarStatic.js';
import NavBarPopout from './components/NavBarPopout.js';
import {getMailbox, getMailboxNames, getUnreadEmails} from './APICalls.js';
import EmailViewerMobile from './components/EmailViewerMobile.js';
import EmailViewerDesktopSm from './components/EmailViewerDesktopSm.js';
import EmailViewerDesktopLg from './components/EmailViewerDesktopLg.js';
import SettingsViewerMobile from './components/SettingsViewerMobile.js';
import SettingsViewerDesktop from './components/SettingsViewerDesktop.js';

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  // changing the mailbox name with setMailboxName will also change the actual
  // mailbox with useEffect
  const [mailbox, setMailbox] = useState([]);
  const [mailboxName, setMailboxName] = useState('inbox');
  const [mailboxesList, setMailboxesList] = useState([]);
  // last index of mailboxesListUnread is the # of unread starred emails
  const [mailboxesListUnread, setMailboxesListUnread] = useState([]);
  const [isMailboxEmpty, setIsMailboxEmpty] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [emailDrawerOpen, setEmailDrawerOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  // selectedIndex makes sure the hilighted mailbox on navbar stays consistent
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currEmailIndex, setCurrEmailIndex] = useState(0);
  // setting some default props to avoid type errors in EmailViewer on mount
  const [currEmail, setCurrEmail] = useState({
    to: {
      name: '',
      from: '',
      avatar: '',
    },
    from: {
      name: '',
      from: '',
      avatar: '',
    },
    mailbox: '',
  });
  const [userSettings, setUserSettings] = useState({
    name: 'CSE183 Student',
    email: 'cse183student@ucsc.edu',
  });

  useEffect(() => {
    getMailbox(mailboxName, setMailbox, setIsMailboxEmpty);
  }, [mailboxName]);

  useEffect(() => {
    getMailbox(mailboxName, setMailbox, setIsMailboxEmpty);
  }, [JSON.stringify(mailboxesListUnread)]);

  useEffect(() => {
    getMailboxNames(setMailboxesList);
    getUnreadEmails(mailboxesList, setMailboxesListUnread);
  }, [mailboxesList.length]);

  return (
    <Grid container spacing={1}>
      <EmailContext.Provider value={{
        mailbox, setMailbox,
        mailboxName, setMailboxName,
        mailboxesList, setMailboxesList,
        mailboxesListUnread, setMailboxesListUnread,
        isMailboxEmpty, setIsMailboxEmpty,
        navDrawerOpen, setNavDrawerOpen,
        emailDrawerOpen, setEmailDrawerOpen,
        settingsDialogOpen, setSettingsDialogOpen,
        selectedIndex, setSelectedIndex,
        currEmail, setCurrEmail,
        currEmailIndex, setCurrEmailIndex,
        userSettings, setUserSettings,
      }}>
        <TopMenu />
        <NavBarPopout />
        <NavBarStatic />
        <Mailbox />
        <EmailViewerMobile />
        <EmailViewerDesktopSm />
        <EmailViewerDesktopLg />
        <SettingsViewerMobile />
        <SettingsViewerDesktop />
      </EmailContext.Provider>
    </Grid>
  );
}

export default App;
