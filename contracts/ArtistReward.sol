// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract ArtistReward is ERC20 {
     using Counters for Counters.Counter;
    Counters.Counter private _Ids;

    mapping(address => uint) public  balances;
    //mapping(address =>  Fans) public  fans_addr;
    // address payable[] public fansList;
    event Sent(address from ,address to , uint amount,string message,string fanname,string artistname);
    

    struct Events {

        Counters.Counter id;
        string fanname;
        //uint256 fanId;
        string artistname;
        //uint artistId;
        address fan_addr;
        address artist_Add;
        string message;
        uint256 timestamp;
        uint256 amount;
    }

    Events EventsInfo; 
    Events[] public Eventslist;

    //Fans payable[] public fans_list;
    address payable public owner;

    constructor() payable ERC20("ArtistRewards", "AR") {
        
        owner = payable(msg.sender);
        // FanInfo = Fans()


    }

    modifier Owner() {
        require(owner == msg.sender, "You are the owner");
        _;
    }

    function balanceof() public view returns(uint){
        return address(this).balance;
    }
    function balanceofOwner() public view returns(uint256){
        return owner.balance;
    }

 

    function Send(address payable receiver,string memory fanname,string memory artistname,uint256  amount,  string memory message)  payable external {
    
    require(amount > 0);
    // balances[msg.sender] -= amount;
    // balances[receiver] += amount;
    payable(receiver).transfer(amount);
    EventsInfo = Events(_Ids,fanname,artistname,msg.sender,receiver,message,block.timestamp,msg.value);
    
    Eventslist.push(EventsInfo);
    _Ids.increment();

    emit Sent(msg.sender,receiver,amount,message,fanname,artistname);
}


}