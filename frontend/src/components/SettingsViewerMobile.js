import React from 'react';
import {Hidden} from '@material-ui/core';
import SettingsViewer from './SettingsViewer.js';

/**
 * Parent JSX for the various email viewers
 * Note: The code for the email viewers were heavily influenced by the examples
 * at https://material-ui.com/components/dialogs/#full-screen-dialogs
 * @return {Object} JSX
 */
export default function EmailViewerMobile() {
  return (
    <Hidden mdUp>
      <SettingsViewer />
    </Hidden>
  );
}
