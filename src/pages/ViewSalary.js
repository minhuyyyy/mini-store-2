import { Button } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "materialize-css";
import useSessionStorage from "../hooks/useSessionStorage";

function ViewSalary() {
  const [accounts, setAccounts] = useState([]);
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState([]);
  const [msg, setMsg] = useState("");
  const { getItem } = useSessionStorage();
  const fetchData = async () => {
    try {
      axios.get("http://vps.akabom.me/api/employee").then((response) => {
        setAccounts(response.data);
        return response.data;
      });
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    checkUser();
  }, [user]);

  const checkUser = async () => {
    try {
      const userData = getItem("user"); // Assuming "user" is the key you've used for the user data
      if (user.position === "Manager" || userData.role === "Manager") {
        setCurrentUser(user);
        await fetchData();
      } else if (user.role !== "Manager") {
        setMsg("Only Managers can view this page");
      }
    } catch (e) {
      console.error(e);
      setMsg("Something went wrong");
    }
  };
  return (
    <div>
      {currentUser ? (
        accounts.map((acc) => {
          <Button>
            {acc.id}:{acc.fullName}
          </Button>;
        })
      ) : (
        <h2>Login to view page</h2>
      )}
    </div>
  );
}

export default ViewSalary;
