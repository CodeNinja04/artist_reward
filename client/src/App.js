/* eslint-disable array-callback-return */
import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import Artist from "./artifacts/contracts/Artist.sol/ArtistReward.json";
import { useMoralis, useMoralisFile  } from "react-moralis";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Alert } from '@mui/material';
import TextField from '@mui/material/TextField';
import Moralis from 'moralis';
import 'semantic-ui-css/semantic.min.css'
import { Button, Loader, Message, Input,Card,Image,Icon} from 'semantic-ui-react'
import NavBarArtist from "./components/NavBarArtist"
import NavBarUser from "./components/NavBarUser"
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
    saveFile, moralisFile
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

  const [artistid, setArtistid] = useState("2");
  const [artistdata, setArtistdata] = useState();
  const [file,setFile]=useState();
  const [imagehash,setImagehash]=useState();
  const [res,setRes]=useState();
  const [nft, setNft] = useState({
    id: "",
    fanname: "",
    artistname: "",
    message: "",
    file:""
  })
  const [artistreply,setArtistreply] = useState(
   
  )
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
      <div className="auth">

        {/* <span><Button primary onClick={() => authenticate()}>Authenticate</Button></span> */}
        <div className="card">
          <Card color="red"  >
            <Image src='data:image/jpeg;base64,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' wrapped ui={false} />
          <Card.Content >
            <Card.Header>ARTIST REWARD SYSTEM</Card.Header>
            <Card.Meta>
              <span className='date'>Created in 2022</span>
            </Card.Meta>
            <Card.Description>
                <p>Description about artist reward</p> 
                <Button primary onClick={() => authenticate()}>Authenticate</Button>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name='user' />
              x no of users
            </a>
          </Card.Content>
        </Card>
        </div>
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
  }
  
  // USER PART
  
  else if (user.attributes.role === "user") {
    // request access to the user's MetaMask account

    // call the smart contract, read the current greeting value



    async function fetchRewards() {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log(await signer.getAddress() )
        
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

    async function getrewards() {

      const Reply = Moralis.Object.extend("reply");
      const query = new Moralis.Query(Reply);

      query.equalTo("fanname", user.get('username'));

      const results = await query.find();

      setArtistreply(results);
      console.log(results)
      console.log("username", user.get('username'))
}


    // const saveFileIPFS = async(f) => {
    //   console.log(f)
    //   const fileIpfs = await saveFile(f.name, file, { saveIPFS: true })
    //   console.log(fileIpfs)
    //   return(fileIpfs)
    // }

    
async function setnft() {
  //const hash=await saveFileIPFS(file[0]);
  Moralis.enableWeb3();
  if(nft.file){
  const fileIpfs = new Moralis.File(nft.file[0].name, nft.file[0])
  await fileIpfs.saveIPFS();
  
  console.log(fileIpfs.ipfs());

  let metadata = {
    name:"event nft by"+nft.artistname+" to " + nft.fanname,
    description: nft.message,
    image: fileIpfs.ipfs()
  }
  console.log(metadata);
  const jsonFile = new Moralis.File("metadata.json", { base64: Buffer.from(JSON.stringify(metadata)).toString('base64') });
  await jsonFile.saveIPFS();

  let metadataHash = jsonFile.hash();
  console.log(jsonFile.ipfs())


  let res=  await Moralis.Plugins.rarible.lazyMint({
    chain: 'rinkeby',
    userAddress: user.get('ethAddress'),
    tokenType: 'ERC721',
    tokenUri: 'ipfs://' + metadataHash,
    royaltiesAmount: 5, // 0.05% royalty. Optional
  })
  console.log(res);

  setRes(res);
}
else{
  alert("file is not defined");
  console.log(nft);
}
}


   


return (
      <div className="App">
        <NavBarUser />
        <header className="App-header">
         
         
          <div className="form" >
            <form onSubmit={send}  >
            <Input
              onChange={(e) =>
                setReward({ ...reward, artist_id: e.target.value })
              }
              placeholder="ArtistID"
            />
            <Input
              onChange={(e) =>
                setReward({ ...reward, fanname: e.target.value })
              }
              placeholder="FanName"
            />
            <Input
              onChange={(e) =>
                setReward({ ...reward, artistname: e.target.value })
              }
              placeholder="ArtistName"
            />
            <Input
              onChange={(e) =>
                setReward({ ...reward, artist_addr: e.target.value })
              }
              placeholder="Artist-Address"
            />
            <Input
              onChange={(e) =>
                setReward({ ...reward, message: e.target.value })
              }
              placeholder="Message"
            />
            <Input
              onChange={(e) => setReward({ ...reward, value: e.target.value })}
              placeholder="Amount"
            />
              <p><Button negative>Submit</Button></p>
          </form>
          </div>
        <div className="middle">
          <Button positive onClick={getrewards}>Get Reward</Button>
          {/* <Grid   style={{backgroundColor:"grey",display: "flex"}}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
             
              <CalendarPicker date={date} onChange={(newDate) => setDate(newDate)}  /> */}


          {/* </LocalizationProvider>
          </Grid> */}
          {/* <button onClick={send}>Set Greeting</button> */}

        </div >

{console.log(reward)}
{console.log(artistreply)}
{console.log(file)}
          {/* <div>
          {!artistreply ? <Loader size="large" active inline='centered' />  : artistreply.map((row)=>{

            {console.log(row.id)}

            } )}
      
          </div> */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ArtistId</StyledTableCell>
                <StyledTableCell align="left">FanName</StyledTableCell>
                <StyledTableCell align="left">ArtistName</StyledTableCell>
                <StyledTableCell align="center">Address</StyledTableCell>
                <StyledTableCell align="center">Upload</StyledTableCell>
                <StyledTableCell align="center">Mint</StyledTableCell>
               


              </TableRow>
            </TableHead>
            <TableBody>
              {!artistreply ? <Loader size="large" active inline='centered' /> : artistreply.map((row) => (

                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >

                  <StyledTableCell component="th" scope="row">
                    {row.id}
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.attributes.fanname}</StyledTableCell>
                  <StyledTableCell align="left">{row.attributes.artistname}</StyledTableCell>
                  <StyledTableCell align="center" >{row.attributes.message} </StyledTableCell>
                  <StyledTableCell align="center" ><input type="file" onChange={(e) => setNft({file:e.target.files,fanname:row.attributes.fanname,artistname:row.attributes.artistname,message:row.attributes.message})} /> </StyledTableCell>
                  {console.log(nft)}
                  <StyledTableCell align="center"><Button primary  onClick={setnft} >MINT</Button></StyledTableCell>

                </TableRow>

              ))}
            </TableBody>
          </Table>
        </TableContainer>

        </header>
      </div>
    );
  } 
  
  // ARTIST PART


  else {

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
        <NavBarArtist />
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
