import React, { useState } from "react";
import { storage } from "../firebase";
import { useAuth } from '../contexts/AuthContext'

const Photo = () => {
  const { currentUser, imgUrl, setImgUrl } = useAuth()
  const [image, setImage] = useState(null);
//   const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChange = e => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async() => {
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
          .ref(`images/${currentUser.uid}/profile.jpg`)
          .getDownloadURL()
          .then(url => {
            setImgUrl(url);
          });
      }
    );
  };

  return (
    <div>
      <p className="title">Profile</p>
      <br />
      <img src={imgUrl || "http://via.placeholder.com/300"} height="200" alt="firebase" />  
        <br />
        <br />
        <progress value={progress} max="100" />
        <br />
        <br />
        <input type="file" onChange={handleChange} />
        <br />
        <br />
        <button onClick={handleUpload}>Upload</button>
        <br />
        <br />
    </div>
  );
};

export default Photo;