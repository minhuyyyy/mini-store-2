import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import useSessionStorage from "./useSessionStorage";
import { useNavigate } from "react-router-dom";

export default function useUser() {
  const { user, setUser } = useContext(AuthContext);
  const { setItem } = useSessionStorage();
  const navigate = useNavigate();

  function preventBack() {
    window.history.forward();
  }

  const addUser = (user) => {
    setUser(user);
    setItem("user", JSON.stringify(user));
  };

  const removeUser = () => {
    preventBack();
    setUser(null);
    setItem("user", null);
    navigate("/");
  };

  return { user, addUser, removeUser };
}
