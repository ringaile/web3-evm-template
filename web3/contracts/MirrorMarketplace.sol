//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MirrorMarketplace {
    uint listingId;

    enum ListingStatus {
        Listed,
        Cancelled,
        Sold
    }

    struct Listing {
        IERC721 token;
        address seller;
        uint tokenId;
        uint price;
        uint timestamp;
        ListingStatus status;
    }

    mapping (uint => Listing) private listings;
    mapping (address => uint[]) private nftsOwnedByUser;

    function getnftsOwnedByUser(address _address)public view returns(uint [] memory){
        return nftsOwnedByUser[_address];
    }
}