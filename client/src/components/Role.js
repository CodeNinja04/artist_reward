import React, { useState, useEffect } from 'react'

import { useMoralis } from "react-moralis";
import { Navigate, useNavigate } from "react-router-dom";



const Role = () => {

    let navigate = useNavigate();
    const [roleset,setRoleset]=useState("");
    const [imagehash, setImagehash] = useState("");

    const {
      login,
      isAuthenticated,
      user,
      setUserData,
      userError,
      isUserUpdating,
    } = useMoralis();
    const [current,setCurrent]=useState("");

    useEffect(() => {
      setCurrent(user);
      console.log(user);
    }, [user]);

    const onSubmit = () => {

    }

if (!isAuthenticated || current == null || current === undefined) {
  

  return (
    <div>
      {/* <button onClick={() => authenticate()}>Authenticate</button> */}
      PLEASE WAIT
     
    </div>
  );
}

else if (current.attributes.role===undefined || current.attributes.role==null) {

    return (
      <div>
        {" "}
        {userError && <p>{userError.message}</p>}
        Please Select your ROLE
        <form>
          <select onChange={(e) => setRoleset(e.currentTarget.value)}>
            <option value="fan">FAN</option>
            <option value="artist">ARTIST</option>
          </select>
          <input
            type="text"
            placeholder="Enter your image hash on ipfs"
            onChange={(e) => setImagehash(e.currentTarget.value)}
          />
          <button
            onClick={() =>
              setUserData({
                username: current.attributes.username,
                email: current.attributes.email,
                role: roleset,
                imagehash: imagehash,
              }).then(navigate("/"))
            }
            disabled={isUserUpdating}
          >
            SUBMIT
          </button>
        </form>
      </div>
    );


}

else{
    return ( 
    <>

     your ROLE  is :
    {current.attributes.role}
   
    </> );
}
}
export default Role;