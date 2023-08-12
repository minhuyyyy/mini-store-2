import React, { useState, useEffect } from "react";
import { Input, Button, FormControl, ThemeProvider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
// import { db } from "../db/dbConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  writeBatch,
} from "firebase/firestore";
import { getImageLink } from "../db/getImgLink";
import { toast } from "react-toastify";
import { theme } from "./ManageAccounts";
import env from "react-dotenv";
export default function UpdateProfile() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [downloadURL, setDownloadURL] = useState("");
  const [docID, setDocID] = useState("");
  const [uid, setUid] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    setUid(user.ID);
  }, [user]);

  useEffect(() => {
    getData();
  }, [uid]);

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [image]);

  const [formData, setFormData] = useState({
    img: "",
    email: "",
    name: "",
  });

  const handleAddPhoto = async (e) => {
    try {
      const file = e.target.files[0];
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
      setDownloadURL(await getImageLink(file));
    } catch (e) {
      console.log(e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getData = async () => {
    // const q = query(
    //   collection(db, `${env.REACT_APP_USER_DB_URL}`),
    //   where("ID", "==", uid)
    // );
    // const snapshot = await getDocs(q);
    // snapshot.forEach((doc) => {
    //   const newData = doc.data();
    //   setImageUrl(newData.img);
    //   setFormData({
    //     img: newData.img,
    //     email: newData.email,
    //     name: newData.name,
    //   });
    //   setDocID(doc.id);
    // });
  };

  const handleUpdate = async () => {
    // await getData();
    // const userDocRef = doc(db, `${env.REACT_APP_USER_DB_URL}/${docID}`);
    // try {
    //   const batch = writeBatch(db);
    //   batch.update(userDocRef, {
    //     img: imageUrl,
    //     email: formData.email,
    //     name: formData.name,
    //   });
    //   setFormData({
    //     img: "",
    //     email: "",
    //     name: "",
    //   });
    //   setImageUrl("");
    //   await batch.commit();
    //   toast.success("Profile updated successfully");
    //   navigate("/viewprofile");
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ paddingLeft: "50px" }}>
        {uid && (
          <>
            <div>
              <Button
                style={{
                  marginTop: 40,
                }}
                variant="contained"
                color="select"
                onClick={() => {
                  document.querySelector("#handleAddPhoto").click();
                }}
              >
                Change Photo
              </Button>
            </div>
            <input
              type="file"
              id="handleAddPhoto"
              onChange={(e) => handleAddPhoto(e)}
              name="img"
              style={{ display: "none" }}
            />
            <br />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                style={{
                  maxWidth: "200px",
                  maxHeight: "250px",
                  marginBottom: "30px",
                }}
              />
            )}
            <br />
            <div>
              <FormControl sx={{ width: "80%" }}>
                <label>Email</label>
                <Input
                  id="email"
                  name="email"
                  variant="standard"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <br />
              </FormControl>
            </div>
            <div>
              <FormControl sx={{ width: "80%" }}>
                <label>Name</label>
                <Input
                  id="name"
                  name="name"
                  variant="standard"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <br />
              </FormControl>
            </div>
            <div style={{ height: 200 }}>
              <Button variant="contained" onClick={handleUpdate} color="update">
                Update Account
              </Button>
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
}
