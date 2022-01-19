//import logo from "./logo.svg";
//import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import ArtistRewardabi from "../contracts/ArtistReward.json";
import Web3 from "web3";
//import Navbar from "./components/Navbar";

function App() {
  const [account, setAccount] = useState("");
  const [artistacc, setArtistacc] = useState(
    "0xB5c70149ee6880F79E319652040aEb685e39D590"
  );
  const [data, setData] = useState("");
  const [eventid, setEventid] = useState("");
  const [balance, setBalance] = useState("");
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [event, setEvent] = useState();

  useEffect(() => {
    loadweb3();
    LoadBlockchaindata();
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

  const LoadBlockchaindata = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    //console.log(accounts.toString());
    let amt = await window.web3.eth.getBalance(accounts[0]);
    const amt1 = await web3.utils.fromWei(amt, "ether");
    setBalance(amt1);
    console.log(amt1);

    const networkId = await web3.eth.net.getId();
    const networkData = ArtistRewardabi.networks[networkId];

    if (networkData) {
      const Eventdata = new web3.eth.Contract(
        ArtistRewardabi.abi,
        networkData.address
      );
      setData(Eventdata);
      console.log(await Eventdata.methods);
      const x = await Eventdata.methods.symbol().call();
      setSymbol(x);
      console.log(x);
    } else {
      window.alert("smart contract not deployed");
    }
  };

  const send = async () => {
    await data.methods
      .Send(artistacc, "fan1", "artist1", 10000000, "hello artist thanks")
      .send({ from: account, value: Web3.utils.toWei("1", "ether") })
      .on("transactionhash", () => {
        console.log("send");
      });
  };

  const sendartist = async () => {
    await data.methods
      .createArtist(artistacc, "artist2", "singer")
      .send({ from: account })
      .then(console.log("artist added"));
  };

  const getEventbyid = async (id) => {
    // await data.methods.Eventslist(id).send({from:account}).on("transactionhash",() => {
    //   console.log("events fetched");
    // });

    let x = await data.methods.Eventslist(id).call();
    return x;
  };

  const getArtistbyid = async (id) => {
    // await data.methods.Eventslist(id).send({from:account}).on("transactionhash",() => {
    //   console.log("events fetched");
    // });

    let x = await data.methods.Artistslist(id).call();
    console.log(x);
  };

  const getEventslist = async () => {
    console.log(await data.methods.getEvents().call());
  };

  const getArtistslist = async () => {
    console.log(await data.methods.getArtists().call());
  };

  const onChangeevent = (e) => {
    e.preventDefault();
    setEventid(e.target.value);
    console.log(e.target.value);
    //setChange(false);
  };

  const onSubmitgetevent = async (e) => {
    e.preventDefault();
    //send();
    sendartist();
    //getArtistbyid(eventid);
    //getArtistslist();
    //getEventslist();
    // const test = await getEventbyid(eventid);
    // setEvent(test);
    // setChange(true);
    // console.log(test);
  };

  if (!data && !event) {
    return <div>LOADING</div>;
  }
  return (
    <div className="App">
      Hello
      <p>ACCOUNT:{account}</p>
      <p>BALANCE:{balance}</p>
      <p>SYMBOL :{symbol}</p>
      <form onSubmit={onSubmitgetevent}>
        <h3>GET EVENT INFORMATION</h3>
        <input
          type="number"
          onChange={onChangeevent}
          placeholder="enter event id"
        />
        <p>
          <button>SEND</button>
        </p>
      </form>
      ARTIST NAME : {change && event.artistname}
    </div>
  );
}

export default App;
