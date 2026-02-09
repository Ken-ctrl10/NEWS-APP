import { useEffect, useState } from "react";
import { getCurrentUser, login, logout, register } from "../services/authService";

export default function useAuth() {
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    const onStorage = () => setUser(getCurrentUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const doLogin = async (payload) => {
    const u = login(payload);
    setUser(u);
    return u;
  };

  const doRegister = async (payload) => {
    const u = register(payload);
    setUser(u);
    return u;
  };

  const doLogout = () => {
    logout();
    setUser(null);
  };

  return { user, login: doLogin, register: doRegister, logout: doLogout };
}