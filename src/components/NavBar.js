import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Modals from './Modals'
import Button from '@material-ui/core/Button';
import { BrowserRouter as Router, Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const { currentUser } = useAuth()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
            <Button component={Link} to="/" id="home" display = "none" color="inherit">Home</Button>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
          </Typography>
          {currentUser && <Button id="profile" display = "none" color="inherit" component={Link} to="/profile" >Profile</Button>}
          <Modals />
        </Toolbar>
      </AppBar>
    </div>
  );
}