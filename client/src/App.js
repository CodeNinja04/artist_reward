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
import { Input, Alert } from '@mui/material';
import TextField from '@mui/material/TextField';
import Moralis from 'moralis';
import 'semantic-ui-css/semantic.min.css'
import { Button, Loader, Message } from 'semantic-ui-react'
import NavBar from "./components/NavBar"
import isWeekend from 'date-fns/isWeekend';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import { CalendarPicker } from '@mui/lab';
import Grid from '@mui/material/Grid';


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

  const [messagedata,setMessagedata]=useState({
    message:"Thank you for all your support",
    artistname:"artist",
    fanname:"fanname"
  })

  const [artistid, setArtistid] = useState("artistid");
  const [artistdata, setArtistdata] = useState();
  const [load, setLoad] = useState(false)
  const [date, setDate] = useState(new Date());

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
      <div className="App">
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
        <NavBar />
        <header className="App-header">
         
         <div className="middle"> 
            <Button positive onClick={fetchRewards}>Fetch Reward</Button>
          {/* <Grid   style={{backgroundColor:"grey",display: "flex"}}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
             
              <CalendarPicker date={date} onChange={(newDate) => setDate(newDate)}  /> */}
           
                
              {/* </LocalizationProvider>
          </Grid> */}
          {/* <button onClick={send}>Set Greeting</button> */}

          </div >
          <div className="form">
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
          </div>

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
      e.preventDefault();

      const Reply = Moralis.Object.extend("reply");
      const reply = new Reply();

      reply.set("fanname", messagedata.fanname);
      reply.set("message", messagedata.message);
      reply.set("artistname", messagedata.artistname);

      reply.save()
        .then((reply) => {
          console.log(reply);
            < Alert severity = "success" > Message Sent Successfully</Alert >
        }, (error) => {

          alert('Failed to create new object, with error code: ' + error.message);
        });
    }

console.log(messagedata)
    const list = [
      'You can now have cover images on blog pages',
      'Drafts will now auto-save while writing',
    ]
    return (
      <div className="App">
        <NavBar />
        <header className="App-header">
          <h1 style={{fontWeight:"bold"}}>ARTIST PAGE</h1>
          
         


          <Message header='New Site Features' list={list} />
          
          {/* <Button  negative onClick={() => logout()} disabled={isAuthenticating}>
            Logout
          </Button> */}

         <div className="middle">

            <Button primary onClick={fetchRewardsbyId}>GET REWARDS</Button>
            <Button positive onClick={fetchRewards}>Fetch Reward</Button>
         </div>
         


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
                  <StyledTableCell align="center">Send</StyledTableCell>

                  
                </TableRow>
              </TableHead>
              <TableBody>
                {!artistdata ? <Loader size="large" active inline='centered' /> : artistdata.map((row) => (

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
                    <StyledTableCell align="center"><TextField id="outlined-basic" label="Give Reply" variant="outlined" placeholder="Thank you for all your support" onChange={(e) =>
                      setMessagedata({ fanname:row[1],artistname:row[2], message: e.target.value })
                    } /></StyledTableCell>
                    <StyledTableCell align="right"><Button  primary onClick={sendReply}>REPLY</Button></StyledTableCell>

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
