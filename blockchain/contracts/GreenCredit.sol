// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Import standard, secure, and gas-efficient contracts from OpenZeppelin.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GreenCredit
 * @dev An ERC721 token representing a certified unit of green hydrogen production.
 */
contract GreenCredit is ERC721, ERC721URIStorage, Ownable {
    // A counter to ensure each minted token has a unique ID.
    uint256 private _nextTokenId;

    // The address of the authorized Certifier. Only this address can mint new tokens.
    address private _certifier;

    // A mapping to track which tokens have been retired.
    mapping(uint256 => bool) private _retiredTokens;

    // Events make it easier for off-chain applications to listen for important contract actions.
    event CreditMinted(uint256 indexed tokenId, address indexed producer, string tokenURI);
    event CreditRetired(uint256 indexed tokenId);

    /**
     * @dev The constructor sets up the contract when it's deployed.
     * @param initialOwner The address that will initially own the contract.
     */
    constructor(address initialOwner)
        ERC721("Green Hydrogen Credit", "GHC")
        Ownable(initialOwner)
    {}

    /**
     * @dev Sets or updates the address of the official Certifier.
     * Only the contract owner can call this function.
     * @param certifierAddress The address of the new certifier.
     */
    function setCertifier(address certifierAddress) public onlyOwner {
        require(certifierAddress != address(0), "Certifier address cannot be the zero address");
        _certifier = certifierAddress;
    }

    /**
     * @dev Mints a new Green Credit token and assigns it to a producer.
     * Only callable by the Certifier.
     * @param producer The address of the producer receiving the credit.
     * @param metadataURI A unique URL pointing to the credit's metadata.
     */
    function safeMint(address producer, string memory metadataURI) public {
        require(msg.sender == _certifier, "Only the certifier can mint new credits");
        require(producer != address(0), "Cannot mint to the zero address");

        uint256 tokenId = _nextTokenId++;
        _safeMint(producer, tokenId);
        _setTokenURI(tokenId, metadataURI);

        emit CreditMinted(tokenId, producer, metadataURI);
    }

    /**
     * @dev Retires a token, permanently marking it as "used".
     * Only the current owner of the token can retire it.
     * @param tokenId The ID of the token to be retired.
     */
    function retire(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only the token owner can retire it");
        _retiredTokens[tokenId] = true;
        emit CreditRetired(tokenId);
    }

    /**
     * @dev A public view function to check if a token has been retired.
     * @param tokenId The ID of the token to check.
     * @return bool True if the token is retired, false otherwise.
     */
    function isRetired(uint256 tokenId) public view returns (bool) {
        return _retiredTokens[tokenId];
    }
    
    // --- Overrides for ERC721 and ERC721URIStorage ---
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev This override blocks transfers of retired tokens.
     */
    // --- FIX: Updated the function signature to match OpenZeppelin v5.0 ---
    function _update(address to, uint256 tokenId, address auth) internal virtual override(ERC721) returns (address) {
        address from = _ownerOf(tokenId);

        // Block transfer if token is retired (only applies to non-mint, non-burn).
        if (from != address(0) && to != address(0)) {
            require(!_retiredTokens[tokenId], "Cannot transfer a retired token");
        }

        return super._update(to, tokenId, auth);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // A "getter" function to see the current certifier's address.
    function getCertifier() public view returns (address) {
        return _certifier;
    }
}