import React, { useState, useEffect } from "react";
import { Moralis } from "moralis";
import { useMoralis } from "react-moralis";
import { render } from "react-dom";

const ArtistList = () => {
  const { isAuthenticated, user, authenticate, isAuthenticating } =
    useMoralis();

  const [artistlist, setArtistlist] = useState(null);

  // useEffect(() => {

  //     findartist();

  // },[])

  const findartist = async () => {
    const Artist = Moralis.Object.extend("Artist");
    const query = new Moralis.Query(Artist);
    //query.equalTo("name", current.get("username"))
    const results = await query.find();
    setArtistlist(results);
    console.log(results[0].attributes.name);
  };

  useEffect(() => {
    if (artistlist === undefined || artistlist === null) {
      findartist();
    }
  });

  //
  //render(findartist())

  if (!user) {
    return <p>LOADING</p>;
  } else {
    return (
      <>
        <div>HELLo {user.get("username")}</div>
        {artistlist[0].attributes.name}
      </>
    );
  }
};
export default ArtistList;
