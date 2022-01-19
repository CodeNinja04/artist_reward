import React, { useState, useEffect } from 'react';
import { useMoralis } from "react-moralis";
import { Navigate, useNavigate } from "react-router-dom";

const Signup = () => {
  let navigate = useNavigate();
  const {signup, isAuthenticated, user } = useMoralis();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [type,setType]= useState("fan");
  const [test,setTest]= useState("");

  return (
    <div>
      <input
        placeholder="enter email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <input
        placeholder="enter username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.currentTarget.value)}
      />
      <input
        placeholder="enter password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />

      {/* <input
        placeholder="test"
        type="text"
        value={test}
        onChange={(e) => setTest(e.currentTarget.value)}
      /> */}

      {/* <select onChange={(e) => setType(e.currentTarget.value)}>
        <option value="fan">FAN</option>
        <option value="artist">ARTIST</option>
      </select> */}

      <button
        onClick={() =>
          signup(username, password, email).then(navigate("/role"))
        }
      >
        Sign up
      </button>
    </div>
  );
};
 
export default Signup;