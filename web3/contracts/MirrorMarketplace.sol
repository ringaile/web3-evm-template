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

    event PriceChanged(uint listingId, uint price);

    modifier isOnSale(uint _listingId) {
        require(listings[_listingId].status == ListingStatus.Listed, "Item not on sale");
        _;
    }

    function changePrice(uint _listingId, uint _price) public isOnSale(_listingId) {
        require(msg.sender == listings[_listingId].seller, "Not a seller");
        listings[_listingId].price = _price;
        emit PriceChanged(listingId, _price);
    }
}