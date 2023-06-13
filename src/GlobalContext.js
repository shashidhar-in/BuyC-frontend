import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getCurrentUser = async () => {
    try {
      const res = await axios.get("https://buyc-backend.onrender.com/api/users/current");
      if (res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("error is:" + error);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <GlobalContext.Provider value={{ user, getCurrentUser,setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
