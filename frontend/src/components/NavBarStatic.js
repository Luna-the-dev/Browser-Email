import React from 'react';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import NavBar from './NavBar.js';

/**
 * Returns side navigation bar
 * @return {object} JSX
 */
export default function NavBarStatic() {
  return (
    <Hidden mdDown>
      <Grid item xs={2}>
        <div style={{height: '55px'}}/>
        <NavBar />
      </Grid>
    </Hidden>
  );
}
