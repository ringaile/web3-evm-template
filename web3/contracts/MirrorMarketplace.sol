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

    event Listed(uint listingId, address tokenAddr, address seller, uint tokenId, uint price);

    function list(IERC721 _token, uint _tokenId, uint _price) external {
        require(_price > 0, "Invalid price");
        listings[listingId] = Listing(_token, msg.sender, _tokenId, _price, block.timestamp, ListingStatus.Listed);
        listingId += 1;
        _token.safeTransferFrom(msg.sender, address(this), _tokenId);
        emit Listed(listingId, address(_token), msg.sender, _tokenId, _price);
    }
}