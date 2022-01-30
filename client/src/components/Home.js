import React, { useState, useEffect } from 'react'
import { useMoralis,useMoralisQuery } from "react-moralis";
import Logout from "./Logout";
import { Moralis } from "moralis";

const Home = () => {
   const { isAuthenticated, user, authenticate,isAuthenticating } = useMoralis();
   const [current,setCurrent]=useState(null); 
   const [role,setRole]=useState();
  const [artistlist, setArtistlist] = useState(null);
  const { data, error, isLoading } = useMoralisQuery("Artist");  
useEffect(() => {
     setCurrent(user);
     console.log(user);

   
 
}, [user])
 
const findartist = async () => {
  const Artist = Moralis.Object.extend("Artist");
  const query = new Moralis.Query(Artist);
  //query.equalTo("name", current.get("username"))
  const results = await query.find();

  console.log(results);
  setArtistlist(results);
};

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

   
   
//findartist()


return (
  <div>
    HOME  ARTIST
    <div>
      <Logout />
    </div>
    <p>USERNAME : {current.get("username")}</p>
    <p>Role : {current.attributes.role}</p>

    <p>
      <img src={current.attributes.imagehash} height={200} width={200} />
    </p>

    <p>{artistlist.map((artist)=>{

     <p> {artist.attributes.name} </p>
    })}</p>
  </div>
);


}  

  else{

      //findartist();

    if(isLoading){
      return (<p>PLEASE WAIT</p>)
    }

    else{
   console.log(data);
 return (
   <div>
     HOME USER
     <div>
       <Logout />
     </div>
     <p>USERNAME : {current.get("username")}</p>
     <p>Role : {current.attributes.role}</p>
     <p>
       <img src={current.attributes.imagehash} height={200} width={200} />
     </p>
     <p>
       <select onChange={(e) => console.log(e.currentTarget.value)}>
         {data.map((user) => (
           <option value={user.attributes.image}>{user.attributes.name}</option>
         ))}
       </select>
     </p>
   </div>
 );

      }
    

    
  
  
}

}
 
export default Home;
  




