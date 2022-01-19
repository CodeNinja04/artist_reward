import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";

const Logout = () => {
  const { logout, isAuthenticating, user } = useMoralis();
 



  return (
    <button onClick={() => logout()} disabled={isAuthenticating}>
      LOGOUT
    </button>
  );
};

export default Logout;
