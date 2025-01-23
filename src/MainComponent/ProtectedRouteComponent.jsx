import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingComponent } from "../SideComponent/LoadingComponent";

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      // verify
      if (!accessToken) {
        navigate("/login");
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log('Opps');
    }
  }, [navigate]);



  if (isLoading) {
    return <div><LoadingComponent /></div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
