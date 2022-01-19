import React, { useState, useEffect } from 'react'
import { useMoralis } from "react-moralis";
import Logout from "./Logout";
import { Moralis } from "moralis";

const Home = () => {
   const { isAuthenticated, user, authenticate,isAuthenticating } = useMoralis();
   const [current,setCurrent]=useState(null); 
   const [role,setRole]=useState();
   
useEffect(() => {
     setCurrent(user);
     console.log(user);
 
}, [user])
 

    if (!isAuthenticated|| current==null || current===undefined ) {
      <button onClick={() => authenticate()}>Authenticate</button>;
      
      
      return (
        <div>
          {/* <button onClick={() => authenticate()}>Authenticate</button> */}
          PLEASE WAIT
          <button onClick={() => authenticate()}>Authenticate</button>;



        </div>
      );
    }

   if (current.attributes.role === "artist" ){

   

   // Create a new instance of that class.
   const defineartist = async () =>{

    const Artist = Moralis.Object.extend("Artist");
    const artistdata = new Artist();
    artistdata.set("name", current.get("username"));
    artistdata.set("image",current.attributes.imagehash);
    //artistdata.set("address",current)
    await artistdata.save()

   }

   //defineartist()

   console.log("Saved artist in db")

   const findartist = async () => {
     const Artist = Moralis.Object.extend("Artist");
     const query = new Moralis.Query(Artist);
     //query.equalTo("name", current.get("username"))
     const results = await query.find();
     console.log(results)

   }
   
findartist()




   // Alternatively, you can use the typical Backbone syntax.
   

  }  

  

      
  
   return (
     <div>
       HOME
       <div>
         <Logout />
       </div>
       <p>USERNAME : {current.get("username")}</p>
       <p>Role : {current.attributes.role}</p>
       <p><img src={current.attributes.imagehash} height={200} width={200} /></p>
     </div>
   );
}

 
export default Home;
  




