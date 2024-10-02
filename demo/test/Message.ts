import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
describe("Message Test", function () {
  // reusable async method for deployment
  async function deployMessageFixture() {
    // Contracts are deployed using first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Message = await hre.ethers.getContractFactory("Message");
    const message = await Message.deploy();

    return { message, owner, otherAccount };
  }
  describe("deployment", () => {
    it("Should check if it deployed", async function () {
      const { message, owner } = await loadFixture(deployMessageFixture);

      expect(await message.owner()).to.equal(owner);
    });

    it("Should be able to set message", async function () {
      const { message, owner } = await loadFixture(deployMessageFixture);
      const msg = "Hello world";
      await message.connect(owner).setMessage(msg);
      expect(await message.getMessage()).to.equal(msg);
    });

    it("Should not be able to set message if not the owner", async function () {
      const { message, otherAccount } = await loadFixture(deployMessageFixture);
      const msg = "Hello world";
      await expect(
        message.connect(otherAccount).setMessage(msg)
      ).to.be.revertedWith("You aren't the owner");
    });
  });

  it("Should say ownership transfer checked", async function () {
    const { message, owner, otherAccount } = await loadFixture(
      deployMessageFixture
    );
    await message.connect(owner).transferOwnership(otherAccount);
    expect(await message.owner()).to.be.equal(otherAccount);
  });
 
  it("Should say you can't transfer the ownership", async function () {
    const { message, owner, otherAccount } = await loadFixture(
      deployMessageFixture
    );
   
   await expect(
     message.connect(otherAccount).transferOwnership(owner)
   ).to.be.revertedWith("You aren't the owner");
  });
});
