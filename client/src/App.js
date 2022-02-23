/* eslint-disable array-callback-return */
import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import Artist from "./artifacts/contracts/Artist.sol/ArtistReward.json";
import { useMoralis } from "react-moralis";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Input } from '@mui/material';
import TextField from '@mui/material/TextField';
import Moralis from 'moralis';


//import { isFunction } from "formik";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const ContractAddress = "0x8de5754f6dc14de312f668f82b4bcc8b930e374d";

function App() {
  // store greeting in local state

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const {
    setUserData,
    userError,
    isUserUpdating,
    authenticate,
    isAuthenticated,
    user,
    logout,
    isAuthenticating,
  } = useMoralis();

  const [userdata, setUserdata] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [artistid, setArtistid] = useState("1");
  const [artistdata, setArtistdata] = useState();
  const [load, setLoad] = useState(false)

  const [value, setValue] = useState();
  const [reward, setReward] = useState({
    artist_id: "",
    fanname: "",
    artistname: "",
    artist_addr: "",
    message: "",
    value: "",
  });

  if (!isAuthenticated) {
    return (
      <div>
        <button onClick={() => authenticate()}>Authenticate</button>
      </div>
    );
  } else if (!user.attributes.role) {
    console.log(userdata);

    return (
      <div>
        {/* <pre>{JSON.stringify(user)}</pre> */}

        <div>
          <input
            onChange={(e) =>
              setUserdata({ ...userdata, username: e.target.value })
            }
            placeholder="Username"
          />
          <input
            onChange={(e) =>
              setUserdata({ ...userdata, email: e.target.value })
            }
            placeholder="Email"
          />
          <input
            onChange={(e) =>
              setUserdata({ ...userdata, password: e.target.value })
            }
            placeholder="password"
          />
          <select
            onChange={(e) => setUserdata({ ...userdata, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="artist">Artist</option>
          </select>
          <button
            onClick={() =>
              setUserData({
                username: userdata.username,
                email: userdata.email,
                password: userdata.password,
                role: userdata.role,
              })
            }
            disabled={isUserUpdating}
          >
            Set user data
          </button>
        </div>
      </div>
    );
  } else if (user.attributes.role === "user") {
    // request access to the user's MetaMask account

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
    async function send(e) {
      e.preventDefault();
      if (!reward.artist_addr) return;
      if (typeof window.ethereum !== "undefined") {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          ContractAddress,
          Artist.abi,
          signer
        );
        console.log(signer)

        const tx = await signer.sendTransaction({
          to: reward.artist_addr,
          value: ethers.utils.parseUnits(reward.value, "gwei"),
        });
        // console.log("data: ", tx);
        if (tx) {
          console.log(tx);
          const transaction = await contract.send(
            reward.artist_id,
            reward.fanname,
            reward.artistname,
            reward.artist_addr,
            reward.message,
            reward.value
          );
          await transaction.wait();
          //console.log("done");
        }


      }
    }



    return (
      <div className="App">
        <header className="App-header">
          <button onClick={() => logout()} disabled={isAuthenticating}>
            Logout
          </button>
          {user.get("username")}
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
              onChange={(e) =>
                setReward({ ...reward, fanname: e.target.value })
              }
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
              onChange={(e) =>
                setReward({ ...reward, message: e.target.value })
              }
              placeholder="Message"
            />
            <input
              onChange={(e) => setReward({ ...reward, value: e.target.value })}
              placeholder="Amount"
            />
            <button>Submit</button>
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
  } else {

    //    async function requestAccount() {
    //   await window.ethereum.request({ method: "eth_requestAccounts" });
    // }


    async function fetchRewardsbyId() {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          ContractAddress,
          Artist.abi,
          provider
        );
        try {
          const data = await contract.getRewardbyId(artistid); //user.attributes.id);
          console.log("data: ", data);
          console.log("data: ", data[0][3]);
          setLoad(true)
          setArtistdata(data);
        } catch (err) {
          console.log("Error: ", err);
        }
      }
    }

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

    // if(artistdata){

    // }


    // });

    function sendReply(e) {
      //e.preventDefault();

      const Reply = Moralis.Object.extend("reply");
      const reply = new Reply();

      reply.set("fanname", "test");
      reply.set("message", "test");
      reply.set("artistname", "test");

      reply.save()
        .then((reply) => {

          alert('New object created with objectId: ' + reply.fanname);
        }, (error) => {

          alert('Failed to create new object, with error code: ' + error.message);
        });
    }


    return (
      <div className="App">
        <header className="App-header">
          <button onClick={() => logout()} disabled={isAuthenticating}>
            Logout
          </button>
          ARTIST
          <button onClick={fetchRewardsbyId}>GET REWARDS</button>
          <button onClick={fetchRewards}>Fetch Reward</button>


          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>ArtistId</StyledTableCell>
                  <StyledTableCell align="right">FanName</StyledTableCell>
                  <StyledTableCell align="right">ArtistName</StyledTableCell>
                  <StyledTableCell align="center">Address</StyledTableCell>
                  <StyledTableCell align="left">Message</StyledTableCell>
                  <StyledTableCell align="right">Amount</StyledTableCell>
                  <StyledTableCell align="center">Reply</StyledTableCell>
                  <StyledTableCell align="right">create-nft</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!artistdata ? <p>LOADING</p> : artistdata.map((row) => (

                  <TableRow
                    key={row[1]}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >

                    <StyledTableCell component="th" scope="row">
                      {row[0]}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row[1]}</StyledTableCell>
                    <StyledTableCell align="right">{row[2]}</StyledTableCell>
                    <StyledTableCell align="center" >{row[3]} </StyledTableCell>
                    <StyledTableCell align="left">{row[4]}</StyledTableCell>
                    <StyledTableCell align="right">{row[6].toNumber()} Gwei</StyledTableCell>
                    <StyledTableCell align="center"><TextField id="outlined-basic" label="Give Reply" variant="outlined" /></StyledTableCell>
                    <StyledTableCell align="right"><button>MINT</button></StyledTableCell>

                  </TableRow>

                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </header>
      </div>
    );
  }
}

export default App;
