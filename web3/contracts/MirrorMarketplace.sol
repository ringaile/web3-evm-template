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

    event Unlisted(uint listingId, address tokenAddr, address seller, uint tokenId);

    modifier isOnSale(uint _listingId) {
         require(listings[_listingId].status == ListingStatus.Listed, "Item not on sale");
         _;
    }

    function unlist(uint _listingId) external isOnSale(_listingId) {
        require(msg.sender == listings[_listingId].seller, "Not a seller");
        Listing memory listing = listings[_listingId];
        listings[_listingId].status = ListingStatus.Cancelled;
        listing.token.transferFrom(address(this), listing.seller, listing.tokenId);
        emit Unlisted(_listingId, address(listing.token), listing.seller, listing.tokenId);
    }
}