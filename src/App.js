/*
- Colors disappear when logged in user refreshes page
- When adding fetchData into useEffect, there's an infinite loop
// Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
- useRefs - when to use? It's in modals.js but I don't know why.
- in Modals.js, how do you kniow where functions belong? Outside of export default, 
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
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'


function App() {
  const { currentUser } = useAuth()
  const colors = ['','Red','Yellow','Green','Blue','Orange','Purple','Pink']
  const [colorsUsed, setColorsUsed] = useState({color1: '',color2: '',color3: '',color4: ''})
  const [colorsLeft, setColorsLeft] = useState(colors)
  const [loading, setLoading] = useState(false)
  
  let colorsUsedNow = colorsUsed
  let colorsLeftNow = colorsLeft
  
  const ref = firebase.firestore().collection("home")
  
  const fetchData=()=>{
    setLoading(true)
    ref.onSnapshot((querySnapshot)=>{
      querySnapshot.forEach((doc) => {
        if (currentUser && doc.id===currentUser.uid) { 
          setColorsUsed(doc.data()) 
          console.log(doc.id)
          console.log(doc.data())
          console.log(colorsUsed)
        }
      })
    })
    colorsUsedNow = Object.values(colorsUsed)
    colorsLeftNow = colors.filter((color)=>{
      return !colorsUsedNow.includes(color)
    })
    setColorsLeft(colorsLeftNow)
    setLoading(false)
  }
  
  const saveData = async() => {
    if (currentUser) {
      await setDoc(doc(db, "home", currentUser.uid), colorsUsed);
      console.log('saveData')
      console.log(colorsUsed)
    } else {
      await setDoc(doc(db, "home", "noLogin"), colorsUsed);
    }
  }
  
  useEffect(() => {
    fetchData()
  },[currentUser]) // loads player's colors whenever user logins aka currentUser changes
  
  useEffect(() => {
    saveData()
  },[colorsUsed, colorsLeft, saveData])// updates colorsUsed in firestore. only called upon mount, read about lifecycle hooks.
  
  return (
    <AuthProvider>
      <main>
      <NavBar />  
      <p className="title">Game Lobby</p>
        <Container maxWidth="md" id="grid">
          {loading && <Box fontSize={24} textAlign="center" mb={6}>Loading...</Box> }
          {currentUser && <Box fontSize={24} textAlign="center" mb={6}>Current User: {currentUser.email}</Box> }
          <Grid container spacing={5} justifyContent="center">
            <CreateBox title = 'P1' colorNum = 'color1' colorsUsed={colorsUsed} setColorsUsed={setColorsUsed} colorsUsedNow={colorsUsedNow} colorsLeft={colorsLeft} setColorsLeft={setColorsLeft} colorsLeftNow={colorsLeftNow} />
            <CreateBox title = 'P2' colorNum = 'color2' colorsUsed={colorsUsed} setColorsUsed={setColorsUsed} colorsUsedNow={colorsUsedNow} colorsLeft={colorsLeft} setColorsLeft={setColorsLeft} colorsLeftNow={colorsLeftNow} />
            <CreateBox title = 'P3' colorNum = 'color3' colorsUsed={colorsUsed} setColorsUsed={setColorsUsed} colorsUsedNow={colorsUsedNow} colorsLeft={colorsLeft} setColorsLeft={setColorsLeft} colorsLeftNow={colorsLeftNow} />
            <CreateBox title = 'P4' colorNum = 'color4' colorsUsed={colorsUsed} setColorsUsed={setColorsUsed} colorsUsedNow={colorsUsedNow} colorsLeft={colorsLeft} setColorsLeft={setColorsLeft} colorsLeftNow={colorsLeftNow} />
          </Grid>
        </Container>
      </main>
    </AuthProvider>
  );
}

export default App;