import { useEffect, useState } from "react";

export const useAuth = () => {
  const [token, setToken] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
    setToken(token as string);
  }, []);

  return { token, isAuthenticated };
};
