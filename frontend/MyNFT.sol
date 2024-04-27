// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DKHomesNFT is ERC721URIStorage, ReentrancyGuard {
    address public owner;
    mapping(uint => bool) private _homeExists;
    uint public homesSold = 0;
    
    

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() ERC721("DK Homes", "DKH") {      
        owner = msg.sender;
    }

    function createNFT(string memory _tokenURI, uint _tokenId) external payable nonReentrant returns (uint256) {
        require(!_homeExists[_tokenId], "Home with this ID already exists");

        _mint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);

        homesSold++;
        _homeExists[_tokenId] = true;
        return _tokenId;
    }

    function withdraw() public onlyOwner nonReentrant {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
