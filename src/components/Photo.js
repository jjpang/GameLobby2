import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { storage, db } from "../firebase";
import { useAuth } from '../contexts/AuthContext'
import { doc, setDoc, getDoc } from "firebase/firestore/lite";

const Photo = () => {
  const { currentUser, imgUrl } = useAuth()
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChange = e => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async() => {
    console.log(currentUser.uid)
    const uploadTask = storage.ref(`images/${currentUser.uid}/profile.jpg`).put(image);
    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      error => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            setUrl(url);
          });
      }
    );
    await setDoc(doc(db, "home", currentUser.uid), { url: url }, {merge: true})
  };
  
    //   console.log("image: ", image);

  const getUrl = async() => {
    
    const docSnap = await getDoc(doc(db, "home", currentUser.uid))
    console.log(docSnap.data())
    setUrl(docSnap.data())
    console.log(url)
  }

  useEffect(() => {
    getUrl()
  },[]) // load user's profile photo

  return (
    <div>
        <img src={imgUrl || "http://via.placeholder.com/300"} height="200" alt="firebase-image" />  
        <br />
        <br />
        <progress value={progress} max="100" />
        <br />
        <br />
        <input type="file" onChange={handleChange} />
        <button onClick={handleUpload}>Upload</button>
        <br />
        <br />
    </div>
  );
};

export default Photo;