import React, { useState } from "react";
import {
  Input,
  Button,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  ThemeProvider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { db } from "../db/dbConfig";
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
export default function UpdateAccount() {
  const [image, setImage] = useState(null);
  const [role, setRole] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [downloadURL, setDownloadURL] = useState("");
  const [isActive, setIsActive] = useState("");
  let docID = "";
  const navigate = useNavigate();
  const { id } = useParams();

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
    role: "",
    password: "",
    isActive: "",
  });

  useEffect(() => {
    getData();
  }, []);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value === "true"; // Convert the string value back to boolean
    setIsActive(value);
  };

  const handleAddPhoto = async (e) => {
    try {
      const file = e.target.files[0];
      setImage(file);
      setImageUrl(await getImageLink(file));
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
    const q = query(
      collection(db, `${env.REACT_APP_USER_DB_URL}/${docID}`),
      where("ID", "==", id)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      const newData = doc.data();
      console.log(newData);
      docID = doc.id;
      setImageUrl(newData.img);
      setRole(newData.role);
      setFormData({
        img: newData.img,
        email: newData.email,
        name: newData.name,
        role: newData.role,
        password: newData.password,
      });
      setIsActive(newData.isActive);
      return docID;
    });
  };

  const handleUpdate = async () => {
    await getData();
    const userDocRef = doc(db, `${env.REACT_APP_USER_DB_URL}/${docID}`);
    try {
      const batch = writeBatch(db);
      batch.update(userDocRef, {
        img: imageUrl,
        email: formData.email,
        name: formData.name,
        role: role,
        password: formData.password,
        isActive: isActive,
      });
      setFormData({
        img: "",
        email: "",
        name: "",
        role: "",
        password: "",
        isActive: "",
      });
      setRole("");
      setIsActive("");
      await batch.commit();
      toast.success("Account updated");
      navigate("/manageaccounts");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ paddingLeft: "50px" }}>
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
        <div>
          <FormControl sx={{ width: "80%" }}>
            <label>Password</label>
            <Input
              id="password"
              name="password"
              variant="standard"
              value={formData.password}
              onChange={handleInputChange}
            />
            <br />
          </FormControl>
        </div>
        <div>
          <FormControl sx={{ width: "80%" }}>
            <label>Role</label>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select selectCate"
              value={role}
              label="Role"
              onChange={handleRoleChange}
            >
              <MenuItem value="Sales">Sales</MenuItem>
              <MenuItem value="Guard">Guard</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
            </Select>
            {role && <p>You selected {role}</p>}
            <br />
          </FormControl>
        </div>
        <br />
        <div>
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">
              Activate
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={isActive ? true : false}
              onChange={(e) => handleStatusChange(e)}
            >
              {isActive != null && (
                <>
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="No"
                  />
                </>
              )}
            </RadioGroup>
          </FormControl>
        </div>
        <div style={{ height: 200 }}>
          <Button variant="contained" onClick={handleUpdate}>
            Update Account
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}
