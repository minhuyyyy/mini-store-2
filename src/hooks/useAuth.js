import useSessionStorage from "./useSessionStorage";
import { useEffect } from "react";
import useUser from "./useUser";
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

  const logout = () => {
    removeUser();
  };

  return { user, logout };
}
