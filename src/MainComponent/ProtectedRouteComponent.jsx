import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { LoadingComponent } from "../SideComponent/LoadingComponent";

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      navigate("/login");
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  if (isLoading) {
    return <div><LoadingComponent/></div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
