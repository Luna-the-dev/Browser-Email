import React, {useContext} from 'react';
import Dialog from '@material-ui/core/Dialog';
import {Hidden} from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import EmailViewer from './EmailViewer.js';
import EmailContext from '../emailContext.js';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

/**
 * Parent JSX for the various email viewers
 * Note: The code for the email viewers were heavily influenced by the examples
 * at https://material-ui.com/components/dialogs/#full-screen-dialogs
 * @return {Object} JSX
 */
export default function EmailViewerMobile() {
  const {emailDrawerOpen, setEmailDrawerOpen} = useContext(EmailContext);

  /**
   * handles the event for closing the email viewer
   */
  function handleClose() {
    setEmailDrawerOpen(false);
  };

  return (
    <Hidden mdUp>
      <Dialog
        fullScreen
        open={emailDrawerOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <EmailViewer />
      </Dialog>
    </Hidden>
  );
}
