import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import useSessionStorage from "./useSessionStorage";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function useUser() {
  const { user, setUser } = useContext(AuthContext);
  const { setItem, removeItem } = useSessionStorage();
  const navigate = useNavigate();

  function preventBack() {
    window.history.forward();
  }

  const addUser = (user) => {
    setUser(user);
    setItem("user", JSON.stringify(user));
  };

  const removeUser = () => {
    setUser(null);
    removeItem("user");
    Cookies.remove("check-in");
    navigate("/");
    window.location.reload();
  };

  return { user, addUser, removeUser };
}
