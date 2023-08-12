import useSessionStorage from "./useSessionStorage";
import { useEffect } from "react";
import useUser from "./useUser";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../db/dbConfig";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const { user, addUser, removeUser } = useUser();
  const { setItem, getItem } = useSessionStorage();
  const navigate = useNavigate();
  useEffect(() => {
    const user = getItem("user");
    if (user) {
      addUser(JSON.parse(user));
    }
  }, []);

  // const login = async (email, password) => {
  //   const q = query(
  //     collection(
  //       db,
  //       "/users/DXgXU4IJtORzkw2E6jTp/specifications/7OM6ChlDeqoZaBMWFXTH/specimens"
  //     ),
  //     where("email", "==", email),
  //     where("password", "==", password),
  //     where("isActive", "==", true)
  //   );
  //   const snapshot = await getDocs(q);
  //   const data = snapshot.docs.find((doc) => doc.data().password === password);
  //   if (data) {
  //     console.log(data.id, "=>", data.data());
  //     const userData = data.data();
  //     setItem(user, JSON.stringify(userData));
  //     // console.log(user);
  //     // toast.success("Logged in successfully");
  //     navigate("/");
  //   } else if (!data) {
  //     alert("Invalid email or password");
  //   }
  // };

  const logout = () => {
    removeUser();
  };

  return { user, logout };
}
