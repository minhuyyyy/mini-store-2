import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../db/dbConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  runTransaction,
} from "firebase/firestore";
import { Button, ThemeProvider } from "@mui/material";
import { theme } from "./ManageAccounts";
import { toast } from "react-toastify";
import env from "react-dotenv";
export default function DeleteAccount() {
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  // const [popup, setPopup] = useState({
  //   show: false, // initial values set to false and null
  //   id: null,
  // });
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const q = query(
      collection(db, `${env.REACT_APP_USER_DB_URL}`),
      where("ID", "==", id)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      const newData = doc.data();
      setData(newData);
    });
  };

  let docID = "";

  const getData = async () => {
    const q = query(
      collection(db, `${env.REACT_APP_USER_DB_URL}`),
      where("ID", "==", id)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
      const data = doc.data();
      docID = doc.id;
      return docID;
    });
  };

  const handleDelete = async () => {
    await getData();
    const userDocRef = doc(db, `${env.REACT_APP_USER_DB_URL}/${docID}`);
    console.log(docID);
    try {
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        if (!userDoc.exists()) {
          throw "Document does not exist!";
        }

        transaction.delete(userDocRef);
      });
      toast.success("Account deleted successfully");
      navigate("/manageaccounts");
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeep = () => {
    navigate("/");
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <div style={{ marginTop: 180 }} className="center">
          <p style={{ fontSize: 30 }}>
            Do you want to delete the user <strong>{data.name}</strong>?
          </p>
          <Button
            variant="contained"
            color="remove"
            style={{ marginRight: 10 }}
            onClick={handleDelete}
          >
            Yes
          </Button>
          <Button
            variant="contained"
            color="update"
            style={{ marginLeft: 10 }}
            onClick={handleKeep}
          >
            No
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}
