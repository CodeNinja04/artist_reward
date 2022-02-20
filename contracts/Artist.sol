// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

contract ArtistReward {

struct Reward{
        string artist_id;
        string fanname;
        string artistname;
        // address fan_addr;
        address artist_add;
        string message;
        uint256 timestamp;
        uint256 amount;
}

mapping(string => Reward[]) rewardMap;
Reward public rewardInfo;
Reward[] public reward_list;
event Send(string artist_id,string  fanname,string artistname,address  artist_addr,string  message,uint256 amount,uint256 timestamp);

function send(string memory artist_id,string memory fanname,string memory artistname,address  artist_addr,string memory message,uint256 amount) public payable {

    require(amount > 0);
    //payable(artist_addr).transfer(msg.value);
    rewardInfo=Reward(artist_id,fanname,artistname, artist_addr, message,block.timestamp,amount);
    rewardMap[artist_id].push(rewardInfo);
    reward_list.push(rewardInfo);

    emit Send(artist_id,fanname,artistname,artist_addr,message,amount,block.timestamp);

}

function getRewards() public view returns(Reward[] memory){
    return reward_list;
}

function getRewardbyId(string memory id) public view returns(Reward[] memory){
    return rewardMap[id];
}



}

