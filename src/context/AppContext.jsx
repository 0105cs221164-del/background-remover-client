import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser]         = useState(null);
  const [token, setToken]       = useState(localStorage.getItem("token") || "");
  const [credits, setCredits]   = useState(0);
  const [loading, setLoading]   = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Attach token to every axios request automatically
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      loadUser();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setLoading(false);
    }
  }, [token]);

  // Restore session on page reload
  const loadUser = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/me`);
      if (data.success) {
        setUser(data.user);
        setCredits(data.user.credits);
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      setCredits(data.user.credits);
      localStorage.setItem("token", data.token);
      toast.success(`Welcome, ${data.user.name}! You have 5 free credits.`);
    }
    return data;
  };

  const login = async (email, password) => {
    const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      setCredits(data.user.credits);
      localStorage.setItem("token", data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken("");
    setCredits(0);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AppContext.Provider value={{ user, token, credits, setCredits, loading, backendUrl, register, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
