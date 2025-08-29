// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Import standard, secure, and gas-efficient contracts from OpenZeppelin.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GreenCredit
 * @dev An ERC721 token representing a certified unit of green hydrogen production.
 * This contract includes:
 * - Role-based access for a "Certifier" to mint new credits.
 * - A mechanism for the token owner to "retire" a credit, preventing future transfers.
 * - Ownership of the contract to manage administrative tasks like setting the Certifier.
 */
contract GreenCredit is ERC721, ERC721URIStorage, Ownable {
    // A counter to ensure each minted token has a unique ID.
    uint256 private _nextTokenId;

    // The address of the authorized Certifier. Only this address can mint new tokens.
    address private _certifier;

    // A mapping to track which tokens have been retired.
    // A retired token cannot be transferred. `mapping(tokenId => isRetired)`
    mapping(uint256 => bool) private _retiredTokens;

    // Events make it easier for off-chain applications to listen for important contract actions.
    event CreditMinted(uint256 indexed tokenId, address indexed producer, string tokenURI);
    event CreditRetired(uint256 indexed tokenId);

    /**
     * @dev The constructor sets up the contract when it's deployed.
     * @param initialOwner The address that will initially own the contract and have administrative rights.
     */
    constructor(address initialOwner)
        ERC721("Green Hydrogen Credit", "GHC") // Sets the token's name and symbol.
        Ownable(initialOwner) // Sets the deployer as the initial owner.
    {}

    /**
     * @dev Sets or updates the address of the official Certifier.
     * Only the contract owner can call this function for security.
     * @param certifierAddress The address of the new certifier.
     */
    function setCertifier(address certifierAddress) public onlyOwner {
        require(certifierAddress != address(0), "Certifier address cannot be the zero address");
        _certifier = certifierAddress;
    }

    /**
     * @dev Mints a new Green Credit token and assigns it to a producer.
     * This is a critical function and is protected to only be callable by the Certifier.
     * @param producer The address of the green hydrogen producer receiving the credit.
     * @param tokenURI A unique URL (often an IPFS hash) pointing to the credit's metadata (JSON file).
     */
    function safeMint(address producer, string memory tokenURI) public {
        require(msg.sender == _certifier, "Only the certifier can mint new credits");
        require(producer != address(0), "Cannot mint to the zero address");

        uint256 tokenId = _nextTokenId++;
        _safeMint(producer, tokenId); // Mints the token and assigns ownership.
        _setTokenURI(tokenId, tokenURI); // Sets the metadata URI for the token.

        emit CreditMinted(tokenId, producer, tokenURI);
    }

    /**
     * @dev Retires a token, permanently marking it as "used".
     * This is the core of preventing double-counting.
     * Only the current owner of the token can retire it.
     * @param tokenId The ID of the token to be retired.
     */
    function retire(uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Only the token owner can retire it");
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
    
    // The following functions are overrides required by Solidity to handle inheritance from multiple contracts.
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev This is a crucial override. We add a check here to ensure that any token
     * transfer (send, sell, etc.) is blocked if the token has been retired.
     */
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721) returns (address) {
        require(!_retiredTokens[tokenId], "Cannot transfer a retired token");
        return super._update(to, tokenId, auth);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // A simple "getter" function to allow anyone to see the current certifier's address.
    function getCertifier() public view returns (address) {
        return _certifier;
    }
}

