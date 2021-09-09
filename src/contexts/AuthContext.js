import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebase"
import { storage } from "../firebase";

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [imgUrl, setImgUrl] = useState()
  const [loading, setLoading] = useState(true)

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log('test')
      setCurrentUser(user)
      setLoading(false)
      if (user) {
        console.log('user logged in: ', user)
        storage.ref('images/' + user.uid + '/profile.jpg').getDownloadURL().then(url => {
          setImgUrl(url)
        console.log('imgUrl')
          console.log(url)
        })
      } else {
        console.log('user logged out')
      }
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    imgUrl,
    setImgUrl,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}