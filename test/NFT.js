const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT Contract", function () {
  let NFT;
  let nft;
  let deployer;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [deployer, addr1, addr2] = await ethers.getSigners();

    nft = await ethers.deployContract("NFT");
    expect(nft , "contract has been deployed");
  });
  describe("Deployment", function () {
    it("should set the correct name and symbol", async function () {
      expect(await nft.name()).to.equal("DApp NFT");
      expect(await nft.symbol()).to.equal("DAPP");
    });

    it("should start with tokenCount = 0", async function () {
      expect(await nft.getTokenCount()).to.equal(0);
    });
  });

  describe("Minting", function () {
    const TOKEN_URI = "ipfs://example-token-uri";

    it("should mint an NFT and increment tokenCount", async function () {
      await nft.mint(TOKEN_URI);

      expect(await nft.getTokenCount()).to.equal(1);
    });

    it("should assign ownership of the minted NFT to the minter", async function () {
      await nft.connect(addr1).mint(TOKEN_URI);

      expect(await nft.ownerOf(1)).to.equal(addr1.address);
    });

    it("should store the correct tokenURI", async function () {
      await nft.mint(TOKEN_URI);

      expect(await nft.tokenURI(1)).to.equal(TOKEN_URI);
    });

    it("should return the tokenId from mint()", async function () {
      const tx = await nft.mint(TOKEN_URI);
      const receipt = await tx.wait();

      // No event emitted, so we check tokenCount instead
      expect(await nft.getTokenCount()).to.equal(1);
    });

    it("should allow multiple NFTs to be minted", async function () {
      await nft.mint("ipfs://token-1");
      await nft.mint("ipfs://token-2");
      await nft.connect(addr1).mint("ipfs://token-3");

      expect(await nft.getTokenCount()).to.equal(3);

      expect(await nft.ownerOf(1)).to.equal(deployer.address);
      expect(await nft.ownerOf(2)).to.equal(deployer.address);
      expect(await nft.ownerOf(3)).to.equal(addr1.address);
    });

    it("should increment token IDs sequentially", async function () {
      await nft.mint("uri1");
      await nft.mint("uri2");

      expect(await nft.tokenURI(1)).to.equal("uri1");
      expect(await nft.tokenURI(2)).to.equal("uri2");
    });
  });

  describe("Edge cases", function () {
    it("should revert when querying a nonexistent token", async function () {
      await expect(nft.ownerOf(1)).to.be.reverted;
    });
  });



});
