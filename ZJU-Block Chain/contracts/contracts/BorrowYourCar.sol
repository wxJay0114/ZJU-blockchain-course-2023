// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// Uncomment the line to use openzeppelin/ERC721
// You can use this dependency directly because it has been installed by TA already
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract BorrowYourCar is ERC721 {
    
    // use a event if you want
    // to represent time you can choose block.timestamp
    event CarBorrowed(uint256 carTokenId, address owner, address borrower, uint256 duration,string message);
    event UpdateCar(uint256 carTokenId, address owner);
    event NotBorrowedList(uint256[] list);
    event CarList(uint256[] list);
    event CarInfo(address owner, address borrower, string message);

    //A struct to store car information
    struct Car {
        address owner;
        address borrower;
        uint256 borrowUntil;
    }

    mapping(uint256 => Car) public cars; // A map from car index to its information
    uint256 private carIdCounter;

    constructor() ERC721("CarBorrowSystem", "CarUnit"){
        carIdCounter = 0;
    }

    function removeTrailingZeros(uint256[] memory array) internal pure returns (uint256[] memory) {
        uint256 length = array.length;
        // 从数组末尾开始遍历，找到第一个非零元素的索引
        while (length > 0 && array[length - 1] == 0) {
            length--;
        }
        // 创建一个新的动态数组，只包含非零元素
        uint256[] memory result = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            result[i] = array[i];
        }
        return result;
    }    

    //Restore to original state when time's up
    function restoreCarInfo(uint256 carTokenId) public{
        cars[carTokenId].borrower = address(0);
        cars[carTokenId].borrowUntil = 0;
    }
    
    //Upload car information,available for everyone who owns a car
    function mintCarNFT(address owner) public virtual {
        uint256 carTokenId = carIdCounter + 1;
        _safeMint(owner, carTokenId);
        carIdCounter++;
        Car storage info = cars[carTokenId-1];
        info.owner = owner;
        info.borrower = address(0);
        info.borrowUntil = 0;
        emit UpdateCar(carTokenId, owner); 
    }
    
    //Owners can check the cars they owns
    function carlistCheck() public virtual {
        uint256[] memory list = new uint256[](10);
        uint256 count = 0;
        for(uint256 carTokenId = 0; carTokenId < carIdCounter; carTokenId++){
            if(msg.sender == cars[carTokenId].owner){
                list[count] = carTokenId+1;
                count++;
            }
        }
        list = removeTrailingZeros(list);
        emit CarList(list);
    }

    //Owners can check the cars that are not borrowed
    function NotBorrowedcarlistCheck() public{
        uint256[] memory notborrowedlist = new uint256[](10);
        uint256 count = 0;
        for(uint256 carTokenId = 0; carTokenId < carIdCounter; carTokenId++){
            if(cars[carTokenId].borrowUntil <= block.timestamp){          //If time's up, restore the information
                restoreCarInfo(carTokenId);
            }
            if((msg.sender == cars[carTokenId].owner) && (cars[carTokenId].borrower == address(0))){
                notborrowedlist[count] = carTokenId+1;
                count++;
            }
        }
        notborrowedlist = removeTrailingZeros(notborrowedlist);
        emit NotBorrowedList(notborrowedlist);
    }

    //Check car information
    function InfoCheck(uint256 carTokenId) public{
        require(carTokenId <= carIdCounter ,"The CarId is Invalid!");
        address owner = address(0);
        address borrower = address(0);
        string memory message1 = "The car is available!";
        string memory message2 = "The car is borrowed!";
        carTokenId--;
        if(cars[carTokenId].borrowUntil <= block.timestamp){          //If time's up, restore the information
            restoreCarInfo(carTokenId);
        }
        owner = cars[carTokenId].owner;
        borrower = cars[carTokenId].borrower;
        if(borrower == address(0)){
            emit CarInfo(owner, borrower, message1);
        }
        else{
            emit CarInfo(owner, borrower, message2);
        }
    }

    // Borrow a car
    function BorrowCar(uint256 carTokenId, uint256 duration) public {
        require(carTokenId <= carIdCounter ,"The CarId is Invalid!");
        carTokenId--;
        if(cars[carTokenId].borrowUntil <= block.timestamp){          //If time's up, restore the information
            restoreCarInfo(carTokenId);
        }
        require(cars[carTokenId].borrower == address(0) ,"This car has been borrowed!");
        cars[carTokenId].borrower = msg.sender;
        address borrower = cars[carTokenId].borrower; 
        address owner = cars[carTokenId].owner;
        uint256 startTime = block.timestamp;
        string memory message3 = "Borrow Successfully!";
        cars[carTokenId].borrowUntil = startTime + duration;
        emit CarBorrowed((carTokenId+1),owner,borrower,duration,message3);
    }


}