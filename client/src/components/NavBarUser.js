import React, { useState,useEffect } from 'react'
import { Menu, Segment,Button,Container } from 'semantic-ui-react'
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
const NabBar = () => {
    const ContractAddress = "0x8de5754f6dc14de312f668f82b4bcc8b930e374d";

    const [activeItem,setActiveItem]=useState('home');
    const [account,setAccount]=useState()
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

useEffect(() => {
    
    fetchaccount();
    
})
  
    const handleItemClick = (e, { name }) => setActiveItem({name})


    async function requestAccount() {
        await window.ethereum.request({ method: "eth_requestAccounts" });
    }

    async function fetchaccount() {
        if (typeof window.ethereum !== "undefined" ) {
            //await requestAccount();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            
            const signer = provider.getSigner();
            //console.log(await signer.getAddress())

        setAccount(await signer.getAddress());
            
        }
    }



        return (
        
            <Segment inverted fixed="top"  >
                <Menu inverted pointed secondary style={{ display: "flex" }}  >
                    
                    <Menu.Item
                        name='home'
                        active={activeItem === 'home'}
                        onClick={handleItemClick}
                    />
                    <Menu.Item
                        name='messages'
                        active={activeItem === 'messages'}
                        onClick={handleItemClick}
                    />
                    
                    <Menu.Item
                        name='friends'
                        active={activeItem === 'friends'}
                        onClick={handleItemClick}
                    />
                    <Menu.Item
                        name='USER PAGE'
                        active={activeItem === 'USER PAGE'}
                        onClick={handleItemClick}
                        header
                       style={{fontWeight:"bold",letterSpacing:"4px",fontFamily:"Helvetica Neue",}}
                    />
                    <Menu.Item
                        name={user.get('username')}
                       
                        position="right"

                    />
                    <Menu.Item name={account}  header style={{letterSpacing:"0px"}}/>
                        
                    
                    <Menu.Item> <Button negative size="mini" onClick={() => logout()} disabled={isAuthenticating}>LOGOUT</Button></Menu.Item>
                   
                    
                </Menu>
            </Segment>
            
        )
}
 
export default NabBar;


// export default class MenuExampleInvertedSecondary extends Component {
//     state = { activeItem: 'home' }

//     handleItemClick = (e, { name }) => this.setState({ activeItem: name })

//     render() {
//         const { activeItem } = this.state

//         return (
//             <Segment inverted>
//                 <Menu inverted pointing secondary >
                    
//                     <Menu.Item
//                         name='home'
//                         active={activeItem === 'home'}
//                         onClick={this.handleItemClick}
//                     />
//                     <Menu.Item
//                         name='messages'
//                         active={activeItem === 'messages'}
//                         onClick={this.handleItemClick}
//                     />
                    
//                     <Menu.Item
//                         name='friends'
//                         active={activeItem === 'friends'}
//                         onClick={this.handleItemClick}
//                     />
//                     <Menu.Item
//                         name='ARTIST PAGE'
//                         active={activeItem === 'ARTIST PAGE'}
//                         onClick={this.handleItemClick}
//                        position="right"
//                        header
//                     />

//                     <Button negative size="mini">LOGOUT</Button>
                    
//                 </Menu>
//             </Segment>
//         )
//     }
// }
