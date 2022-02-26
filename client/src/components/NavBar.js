import React, { useState,useHooks } from 'react'
import { Menu, Segment,Button,Container } from 'semantic-ui-react'
import { useMoralis } from "react-moralis";

const NabBar = () => {
    const [activeItem,setActiveItem]=useState('home');
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


  
    const handleItemClick = (e, { name }) => setActiveItem({name})


        return (
        
            <Segment inverted fixed="top" >
                <Menu inverted pointed secondary  >
                    
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
                        name='ARTIST PAGE'
                        active={activeItem === 'ARTIST PAGE'}
                        onClick={handleItemClick}
                        header
                       style={{fontWeight:"bold",letterSpacing:"4px",fontFamily:"Helvetica Neue",}}
                    />
                    <Menu.Item
                        name={user.get('username')}
                       
                        position="right"

                    />

                    <Button negative size="mini" onClick={() => logout()} disabled={isAuthenticating}>LOGOUT</Button>
                    
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
