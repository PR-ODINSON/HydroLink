import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

// A 'describe' block groups related tests together.
describe("GreenCredit Contract", function () {
  
  // A "fixture" is a setup function that is run once, and its state is snapshotted.
  // Using a fixture is much faster for tests as it avoids re-running the setup every time.
  async function deployGreenCreditFixture() {
    // Get placeholder accounts from Hardhat's local node.
    const [owner, certifier, producer, buyer] = await ethers.getSigners();

    // Deploy the contract.
    const GreenCredit = await ethers.getContractFactory("GreenCredit");
    const greenCredit = await GreenCredit.deploy(owner.address);

    // Perform initial setup: set the authorized certifier.
    await greenCredit.connect(owner).setCertifier(certifier.address);

    // Return all the necessary variables for the tests.
    return { greenCredit, owner, certifier, producer, buyer };
  }

  // --- Test Suite for Deployment ---
  describe("Deployment", function () {
    it("Should correctly set the contract owner", async function () {
      const { greenCredit, owner } = await loadFixture(deployGreenCreditFixture);
      // 'expect' is from the Chai assertion library.
      expect(await greenCredit.owner()).to.equal(owner.address);
    });

    it("Should correctly set the certifier", async function () {
      const { greenCredit, certifier } = await loadFixture(deployGreenCreditFixture);
      expect(await greenCredit.getCertifier()).to.equal(certifier.address);
    });

    it("Should have the correct token name and symbol", async function () {
      const { greenCredit } = await loadFixture(deployGreenCreditFixture);
      expect(await greenCredit.name()).to.equal("Green Hydrogen Credit");
      expect(await greenCredit.symbol()).to.equal("GHC");
    });
  });

  // --- Test Suite for Minting Logic ---
  describe("Minting", function () {
    it("Should allow the certifier to mint a new token to a producer", async function () {
      const { greenCredit, certifier, producer } = await loadFixture(deployGreenCreditFixture);
      const tokenURI = "https://metadata.io/token/1";

      // We expect the minting transaction to emit the 'CreditMinted' event with the correct arguments.
      await expect(greenCredit.connect(certifier).safeMint(producer.address, tokenURI))
        .to.emit(greenCredit, "CreditMinted")
        .withArgs(0, producer.address, tokenURI); // tokenId is 0, producer address, and the URI.
      
      // Verify that the new token's owner and URI are set correctly.
      expect(await greenCredit.ownerOf(0)).to.equal(producer.address);
      expect(await greenCredit.tokenURI(0)).to.equal(tokenURI);
    });

    it("Should REJECT minting attempts from non-certifier accounts", async function () {
      const { greenCredit, owner, producer } = await loadFixture(deployGreenCreditFixture);
      // We expect this transaction to fail ('be reverted') with a specific error message.
      await expect(
        greenCredit.connect(owner).safeMint(producer.address, "uri")
      ).to.be.revertedWith("Only the certifier can mint new credits");
    });

    it("Should REJECT minting to the zero address", async function () {
      const { greenCredit, certifier } = await loadFixture(deployGreenCreditFixture);
      await expect(
        greenCredit.connect(certifier).safeMint(ethers.ZeroAddress, "uri")
      ).to.be.revertedWith("Cannot mint to the zero address");
    });
  });

  // --- Test Suite for Retiring Logic ---
  describe("Retiring", function () {
    it("Should allow the token owner to retire their credit", async function () {
      const { greenCredit, certifier, producer } = await loadFixture(deployGreenCreditFixture);
      await greenCredit.connect(certifier).safeMint(producer.address, "uri");
      
      // The producer (owner of token 0) calls the retire function.
      await expect(greenCredit.connect(producer).retire(0))
        .to.emit(greenCredit, "CreditRetired")
        .withArgs(0); // Expect event with the correct tokenId.

      // Verify the token's status is now retired.
      expect(await greenCredit.isRetired(0)).to.be.true;
    });

    it("Should REJECT retire attempts from non-owners", async function () {
      const { greenCredit, certifier, producer, buyer } = await loadFixture(deployGreenCreditFixture);
      await greenCredit.connect(certifier).safeMint(producer.address, "uri");

      // The 'buyer' account, who does not own the token, attempts to retire it.
      await expect(greenCredit.connect(buyer).retire(0)).to.be.revertedWith(
        "Only the token owner can retire it"
      );
    });

    it("Should PREVENT the transfer of a retired token", async function () {
      const { greenCredit, certifier, producer, buyer } = await loadFixture(deployGreenCreditFixture);
      // 1. Mint a token to the producer.
      await greenCredit.connect(certifier).safeMint(producer.address, "uri");
      // 2. The producer retires the token.
      await greenCredit.connect(producer).retire(0);

      // 3. The producer attempts to transfer the now-retired token. This should fail.
      await expect(
        greenCredit.connect(producer).transferFrom(producer.address, buyer.address, 0)
      ).to.be.revertedWith("Cannot transfer a retired token");
    });
  });
});