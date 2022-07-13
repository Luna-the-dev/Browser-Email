import React, {useContext} from 'react';
import {Hidden} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import EmailViewer from './EmailViewer.js';
import EmailContext from '../emailContext.js';

/**
 * Parent JSX for the various email viewers
 * Note: The code for the email viewers were heavily influenced by the examples
 * at https://material-ui.com/components/dialogs/#full-screen-dialogs
 * @return {Object} JSX
 */
export default function EmailViewerDesktopLg() {
  const {emailDrawerOpen, setEmailDrawerOpen} = useContext(EmailContext);

  /**
   * handles the event for closing the email viewer
   */
  function handleClose() {
    setEmailDrawerOpen(false);
  };

  return (
    <Hidden mdDown>
      <Dialog
        open={emailDrawerOpen}
        onClose={handleClose}
      >
        <EmailViewer />
      </Dialog>
    </Hidden>
  );
}
