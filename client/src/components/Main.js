//import logo from "./logo.svg";
//import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import ArtistRewardabi from "../contracts/ArtistReward.json";
import Web3 from "web3";
import { Moralis } from "moralis";
import { useMoralis, useMoralisQuery } from "react-moralis";
//import Navbar from "./components/Navbar";

function Main() {
   const { isAuthenticated, user, authenticate, isAuthenticating } = useMoralis();
  const [account, setAccount] = useState("");
  const [artistacc, setArtistacc] = useState(
    "0xB5c70149ee6880F79E319652040aEb685e39D590"
  );
  const [dataeth, setdataeth] = useState("");
  const [eventid, setEventid] = useState("");
  const [artist,setArtist]=useState("");
  
  const [balance, setBalance] = useState("");
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [event, setEvent] = useState();
  const { data, error, isLoading } = useMoralisQuery("Artist"); 



  useEffect(() => {
    
    loadweb3();
    LoadBlockchaindataeth();
    //getEventslist();
    
    //findartist();
    //getEventbyid();
  }, []);

  const loadweb3 = async () => {
    if (window.etherium) {
      window.web3 = new Web3(window.etherium);
      await window.web3.etherium.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("non etherium browser");
    }
  };

  const LoadBlockchaindataeth = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    //console.log(accounts.toString());
    let amt = await window.web3.eth.getBalance(accounts[0]);
    const amt1 = await web3.utils.fromWei(amt, "ether");
    setBalance(amt1);
    console.log(amt1);

    const networkId = await web3.eth.net.getId();
    const networkdataeth = ArtistRewardabi.networks[networkId];

    if (networkdataeth) {
      const Eventdataeth = new web3.eth.Contract(
        ArtistRewardabi.abi,
        networkdataeth.address
      );
      setdataeth(Eventdataeth);
      console.log(await Eventdataeth.methods);
      const x = await Eventdataeth.methods.symbol().call();
      setSymbol(x);
      console.log(x);
      const ev = await Eventdataeth.methods.getEvents().call();
      setEvent(ev);
      console.log(ev);
    } else {
      window.alert("smart contract not deployed");
    }
  };


  
 


  const send = async (e) => {
    await dataeth.methods
      .Send(e, "fan1", "artist1", 10000000, "hello artist thanks")
      .send({ from: account, value: Web3.utils.toWei("1", "ether") })
      .on("transactionhash", () => {
        console.log("send");
      });
  };

  const sendartist = async () => {
    await dataeth.methods
      .createArtist(artistacc, "artist2", "singer")
      .send({ from: account })
      .then(console.log("artist added"));
  };

  const getEventbyid = async (id) => {
    // await dataeth.methods.Eventslist(id).send({from:account}).on("transactionhash",() => {
    //   console.log("events fetched");
    // });

    let x = await dataeth.methods.Eventslist(id).call();
    return x;
  };

  const getArtistbyid = async (id) => {
    // await dataeth.methods.Eventslist(id).send({from:account}).on("transactionhash",() => {
    //   console.log("events fetched");
    // });

    let x = await dataeth.methods.Artistslist(id).call();
    console.log(x);
  };

  const getEventslist = async () => {
    //console.log(await dataeth.methods.getEvents().call());
    const ev = await dataeth.methods.getEvents().call();
    setEvent(ev);
    console.log(ev[0].artistname);
    setChange(true);
  };

  const getArtistslist = async () => {
    console.log();
    const ar = await dataeth.methods.getArtists().call();
    setArtist(ar);

  };

  const onChangeevent = (e) => {
    e.preventDefault();
    setEventid(e.target.value);
    console.log(e.target.value);
    //setChange(false);
  };

  const onSubmitgetevent = async (e) => {
    e.preventDefault();
    send();
    //sendartist();
    //getArtistbyid(eventid);
    //getArtistslist();
    //getEventslist();
    // const test = await getEventbyid(eventid);
    // setEvent(test);
    // setChange(true);
    //console.log(event);
  };
  // if(artistlist===null ){
  //    findartist();
  // }

  if (!dataeth && !event && isLoading && !user) {
    return <div>LOADING</div>;
  }
  else{
    console.log(data);
  return (
    <div className="App">
      Hello
      <p>ACCOUNT:{account}</p>
      <p>BALANCE:{balance}</p>
      <form onSubmit={onSubmitgetevent}>
        <h3>GET EVENT INFORMATION</h3>
        <input
          type="number"
          onChange={onChangeevent}
          placeholder="enter event id"
        />
        <p>
          <select onChange={(e) => console.log(e.currentTarget.value)}>
            {data.map((user) => (
              <option value={user.attributes.image}>
                {user.attributes.name}
              </option>
            ))}
          </select>
        </p>
        <p>
          <button>SEND</button>
        </p>
      </form>
      ARTIST NAME : {change && event[0].artistname}
    </div>
  );
    }
}

export default Main;
