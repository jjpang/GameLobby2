import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Link2 from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { useAuth } from '../contexts/AuthContext'
import { BrowserRouter as Link, useHistory } from "react-router-dom";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function Modals() {
  const history = useHistory();
  const [error, setError] = useState("")
  const signUpEmailRef = useRef()
  const signUpPasswordRef = useRef()
  const loginEmailRef = useRef()
  const loginPasswordRef = useRef()
  const { signup, login, logout, currentUser } = useAuth()
  
  const handleSignUp = async(e) => {
    e.preventDefault()
    handleCloseSignUp()
    try {
      await signup(signUpEmailRef.current.value, signUpPasswordRef.current.value)
    } catch {
      setError("Failed to create an account")
    }
  }
  const handleLogin = async(e) => {
    e.preventDefault()
    handleCloseLogin()
    // loadData()
    try {
      await login(loginEmailRef.current.value, loginPasswordRef.current.value)
    } catch {
      setError("Failed to login")
    }
  }
  const handleLogout = async(e) => {
    e.preventDefault()
    history.push("/")
    try {
      await logout()
    } catch {
      setError("Failed to logout")
    }
  }

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [openSignUp, setOpenSignUp] = React.useState(false);
  const [openLogin, setOpenLogin] = React.useState(false);

  const handleOpenSignUp = () => {
    setOpenSignUp(true);
  };

  const handleCloseSignUp = () => {
    setOpenSignUp(false);
  };

  const handleOpenLogin = () => {
    setOpenLogin(true);
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const signUpText = (
    <div id="sign-up-modal" className={classes.paper} style={modalStyle}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign Up
      </Typography>
      <form id="sign-up-form" className={classes.form} noValidate onSubmit={handleSignUp}>
        <TextField
          inputRef={signUpEmailRef}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          inputRef={signUpPasswordRef}  
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        {/*<FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />*/}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign Up
        </Button>
        <Grid container>
        </Grid>
      </form>
    </div>
  );
  
  const loginText = (
    <div className={classes.paper} style={modalStyle}>
      {error && <Alert severity="error">{error}</Alert>}
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Login
      </Typography>
      <form id="login-form" className={classes.form} noValidate onSubmit={handleLogin}>
        <TextField
          inputRef={loginEmailRef}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          inputRef={loginPasswordRef}  
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        {/*<FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />*/}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Login
        </Button>
        <Grid container>
          <Grid item xs>
            {/*<Link href="#" variant="body2">
              Forgot password?
            </Link>*/}
          </Grid>
          <Grid item>
            <Link2 href="#" variant="body2" onClick={()=>{
              handleCloseLogin()
              handleOpenSignUp()
            }}>
              {"Don't have an account? Sign Up"}
            </Link2>
          </Grid>
        </Grid>
      </form>
    </div>
  );

  return (
    <div>
      {!currentUser && <Button id="sign-up-button" display = "none" color="inherit" onClick={handleOpenSignUp}>Sign Up</Button>}
      <Modal
        open={openSignUp}
        onClose={handleCloseSignUp}
      >
        {signUpText}
      </Modal>
      {!currentUser && <Button display = "none" color="inherit" onClick={handleOpenLogin}>Login</Button>}
      <Modal
        open={openLogin}
        onClose={handleCloseLogin}
      >
        {loginText}
      </Modal>
      {currentUser && <Button id="logout-button" display = "none" color="inherit" onClick={handleLogout}>Logout</Button>}
    </div>
  );
}