//import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import ArtistRewardabi from "./contracts/ArtistReward.json";
import Web3 from "web3";
//import Navbar from "./components/Navbar";

function App() {
  const [account, setAccount] = useState("");
  const [artistacc, setArtistacc] = useState(
    "0x5b90741953F7267A9699aAbd18D0D6cC41347e1D"
  );
  const [data, setData] = useState("");
   const [eventid, setEventid] = useState("");
  // const [candidate1, setCandidate1] = useState("");
  // const [candidate2, setCandidate2] = useState("");
  const [balance, setBalance] = useState("");
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState("");
  useEffect(() => {
    loadweb3();
    LoadBlockchaindata();

    //  .then(setBalance(console.log));
    // const value = window.web3.utils.fromWei(amt, "ether");
    // setBalance(value);
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

    //const balance = web3.eth.getBalance(account.toString());
    console.log(accounts.toString());
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
      .send({ from: account, value: Web3.utils.toWei('1', 'ether')
 })
      .on("transactionhash", () => {
        console.log("send");
      });
  };

  const getEvents = async (id) => {
    // await data.methods.Eventslist(id).send({from:account}).on("transactionhash",() => {
    //   console.log("events fetched");
    // });

     let x =  await data.methods.Eventslist(id).call();
     console.log(x);
  }

  const onChange = (e) => {
    e.preventDefault();
    setEventid(e.target.value);
    console.log(e.target.value);
    //setChange(false);
  };
  
  const onSubmit = (e) => {
    e.preventDefault();
    //send();
    getEvents(eventid);
    console.log("done");
    

    
  };

  if (!data) {
    return <div>LOADING</div>;
  }
  return (
    <div className="App">
      Hello
      {/* {data.methods.symbol} */}
      <p>ACCOUNT:{account}</p>
      <p>BALANCE:{balance}</p>
      <div>SYMBOL :{symbol}</div>

      <form onSubmit={onSubmit}>
        <input type="number" onChange={onChange} placeholder="enter event id" />
        <p>
          <button>SEND</button>
        </p>
      </form>
    </div>
  );
}

export default App;
