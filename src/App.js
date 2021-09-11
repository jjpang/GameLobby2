/*
Warning: unstable_flushDiscreteUpdates: Cannot flush updates when React is already rendering.
*/

import React, { useState, useEffect } from 'react';
import firebase, { db } from "./firebase"
import { doc, setDoc } from "firebase/firestore/lite";
import './App.css';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import CreateBox from './components/CreateBox'
import Box from '@material-ui/core/Box';
import NavBar from './components/NavBar'
import { useAuth } from './contexts/AuthContext'
import Photo from './components/Photo'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Try to store states in the highest level component to store data on the user with Firebase. You can only pass downstream, not upstream.

function App() {
  const { currentUser } = useAuth()
  const colors = ['','Red','Yellow','Green','Blue','Orange','Purple','Pink']
  const [colorsUsed, setColorsUsed] = useState({color1: '',color2: '',color3: '',color4: ''})
  const [colorsLeft, setColorsLeft] = useState(colors)
  const [dataFetched, setDataFetched] = useState(false)
  const [dataSaved, setDataSaved] = useState(false)
  
  let colorsUsedNow = colorsUsed
  let colorsLeftNow = colorsLeft
  
  const ref = firebase.firestore().collection("home")
  
  const loadData = async()=>{
    if (!dataFetched && currentUser) { // fetchData on signup or login
      console.log('fetch')
      ref.onSnapshot((querySnapshot)=>{ 
        querySnapshot.forEach((doc) => {
          if (doc.id===currentUser.uid) { // on login
            setColorsUsed(doc.data()) 
            colorsUsedNow = Object.values(colorsUsed)
            colorsLeftNow = colors.filter((color)=>{
              return !colorsUsedNow.includes(color)
            })
            setColorsLeft(colorsLeftNow)
            setDataFetched(true)
          }
        })
      })
      if (!dataFetched) { // on signup aka no id match in firestore because it's a first-time user
        await setDoc(doc(db, "home", currentUser.uid), colorsUsed)
        setDataSaved(true)
        setDataFetched(true)
      } 
    } else {
      console.log('save')
      console.table({dataFetched, colorsUsed, currentUser})
      if (!dataSaved) { // on changes when logged in
        if (currentUser) {
          await setDoc(doc(db, "home", currentUser.uid), colorsUsed)
          setDataSaved(true);
        } else {
          await setDoc(doc(db, "home", "noLogin"), colorsUsed)
          setDataSaved(true);
        }
      }
    }
  }
  
  useEffect(() => {
    loadData() 
  },[colorsUsed, loadData]) // loads and updates firestore 
  // updates colorsUsed in firestore. only called upon mount when the DOM is dropped and the function is being recreated, read about lifecycle hooks.
  
  return (
    <Router>
      <NavBar loadData={loadData} />  
      <Switch>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/">
          <Home currentUser={currentUser} loadData={loadData} colorsUsed={colorsUsed} setColorsUsed={setColorsUsed} colorsUsedNow={colorsUsedNow} colorsLeft={colorsLeft} setColorsLeft={setColorsLeft} colorsLeftNow={colorsLeftNow} dataSaved={dataSaved} setDataSaved={setDataSaved} />
        </Route>
      </Switch>  
    </Router>
  );
}

export default App;

function Profile() {
  return (
    <Box display="flex" justifyContent="center">
      <Photo />
    </Box>
  )
}

function Home({ currentUser, loadData, colorsUsed, setColorsUsed, colorsUsedNow, colorsLeft, setColorsLeft, colorsLeftNow, dataSaved, setDataSaved }) {
  return (
    <main>
      <p className="title">Game Lobby</p>
      <Container maxWidth="md" id="grid">
        {currentUser && <Box fontSize={24} textAlign="center" mb={6}>Current User: {currentUser.email}</Box> }
        <Grid container spacing={5} justifyContent="center">
          <CreateBox title = 'P1' colorNum = 'color1' colorsUsed={colorsUsed} setColorsUsed={setColorsUsed} colorsUsedNow={colorsUsedNow} colorsLeft={colorsLeft} setColorsLeft={setColorsLeft} colorsLeftNow={colorsLeftNow} dataSaved={dataSaved} setDataSaved={setDataSaved} />
          <CreateBox title = 'P2' colorNum = 'color2' colorsUsed={colorsUsed} setColorsUsed={setColorsUsed} colorsUsedNow={colorsUsedNow} colorsLeft={colorsLeft} setColorsLeft={setColorsLeft} colorsLeftNow={colorsLeftNow} dataSaved={dataSaved} setDataSaved={setDataSaved} />
          <CreateBox title = 'P3' colorNum = 'color3' colorsUsed={colorsUsed} setColorsUsed={setColorsUsed} colorsUsedNow={colorsUsedNow} colorsLeft={colorsLeft} setColorsLeft={setColorsLeft} colorsLeftNow={colorsLeftNow} dataSaved={dataSaved} setDataSaved={setDataSaved} />
          <CreateBox title = 'P4' colorNum = 'color4' colorsUsed={colorsUsed} setColorsUsed={setColorsUsed} colorsUsedNow={colorsUsedNow} colorsLeft={colorsLeft} setColorsLeft={setColorsLeft} colorsLeftNow={colorsLeftNow} dataSaved={dataSaved} setDataSaved={setDataSaved} />
        </Grid>
      </Container>
    </main>
  )
}