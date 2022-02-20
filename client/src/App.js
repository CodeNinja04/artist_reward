import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import Artist from "./artifacts/contracts/Artist.sol/ArtistReward.json";

// Update with the contract address logged out to the CLI when it was deployed
const ContractAddress = "0x8de5754f6dc14de312f668f82b4bcc8b930e374d";

function App() {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState();
  const [to,setTo]=useState();
  const [value,setValue] = useState();
  const [reward, setReward] = useState({
    artist_id:"",
    fanname:"",
    artistname:"",
    artist_addr:"",
    message:"",
    value:"",
  });

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call the smart contract, read the current greeting value
  async function fetchRewards() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        ContractAddress,
        Artist.abi,
        provider
      );
      try {
        const data = await contract.getRewards();
        console.log("data: ", data);
        console.log(contract);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  // call the smart contract, send an update
  async function send() {
    if (!reward) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        ContractAddress,
        Artist.abi,
        signer
      );
       
         const tx = signer.sendTransaction({
           to: reward.artist_addr,
           value: ethers.utils.parseUnits((reward.value), "gwei")
         });
         console.log("data: ", tx);
         if(tx){
        const transaction = await contract.send(
            reward.artist_id,
            reward.fanname,
            reward.artistname,
            reward.artist_addr,
            reward.message,
            reward.value
          );
          await transaction.wait();
          console.log("done");
        }
      
     
      //fetchRewards();
    }
  }

   function test() {
    console.log(reward);
  }
  async function sendethr() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
     try {
      const tx = signer.sendTransaction({
        to: to,
        value: ethers.utils.parseEther(value),
      });
        console.log("data: ", tx);
      } catch (err) {
        console.log("Error: ", err);
      }
      
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchRewards}>Fetch Reward</button>
        {/* <button onClick={send}>Set Greeting</button> */}

        <form onSubmit={send}>
          <input
            onChange={(e) =>
              setReward({ ...reward, artist_id: e.target.value })
            }
            placeholder="ArtistID"
          />
          <input
            onChange={(e) => setReward({ ...reward, fanname: e.target.value })}
            placeholder="FanName"
          />
          <input
            onChange={(e) =>
              setReward({ ...reward, artistname: e.target.value })
            }
            placeholder="ArtistName"
          />
          <input
            onChange={(e) =>
              setReward({ ...reward, artist_addr: e.target.value })
            }
            placeholder="Artist-Address"
          />
          <input
            onChange={(e) => setReward({ ...reward, message: e.target.value })}
            placeholder="Message"
          />
          <input
            onChange={(e) => setReward({ ...reward, value: e.target.value })}
            placeholder="Amount"
          />
          <button >Submit</button>
        </form>

        {console.log(reward)}
        <div>
         ARTIST ID: {reward.artist_id} 
          {reward.fanname} 
          {reward.artistname}
          {reward.artist_addr} 
          {reward.message}
          {reward.value}
        </div>
      </header>
    </div>
  );
}

export default App;
