import React, {useContext} from 'react';
import EmailContext from '../emailContext.js';
import Grid from '@material-ui/core/Grid';
import {Hidden} from '@material-ui/core';
import EmailViewer from './EmailViewer.js';

/**
 * Parent JSX for the various email viewers
 * Note: The code for the email viewers were heavily influenced by the examples
 * at https://material-ui.com/components/dialogs/#full-screen-dialogs
 * @return {Object} JSX
 */
function EmailViewerDesktopSm() {
  const {emailDrawerOpen} = useContext(EmailContext);
  return (
    <Hidden only={['xs', 'sm', 'lg', 'xl']}>
      {emailDrawerOpen ?
        <Grid item md={7}>
          <div style={{height: '59px'}}/>
          <EmailViewer />
        </Grid> :
        <div/>
      }
    </Hidden>
  );
}

export default EmailViewerDesktopSm;
