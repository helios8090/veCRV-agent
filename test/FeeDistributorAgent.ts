import { expect } from "chai";
import { network, ethers, upgrades } from "hardhat";

import { abi as VE_ABI } from "../artifacts/contracts/interfaces/IVotingEscrow.sol/IVotingEscrow.json";
import { abi as FEE_DISTRIBUTOR_ABI } from "../artifacts/contracts/interfaces/IFeeDistributor.sol/IFeeDistributor.json";

const ve_addr = "0x5Ba476927Ec72dF1B7717c0cc321797D95cb61B6";
const feeDistributor_addr = "0xef181de80ca41298c4031176f8b2c4268e0c9203";
describe("FeeDistributorAgent", () => {
  let veContract, feeDistributorContract, agentContract;
  let owner, addr1;

  before(async () => {
    [owner, addr1] = await ethers.getSigners();
    console.log({ owner: owner.address, addr1: addr1.address });

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [ve_addr],
    });
    const veSigner = await ethers.provider.getSigner(ve_addr);
    veContract = new ethers.Contract(ve_addr, VE_ABI, veSigner);

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [feeDistributor_addr],
    });
    const feeDistributorSigner = await ethers.provider.getSigner(
      feeDistributor_addr
    );
    feeDistributorContract = new ethers.Contract(
      feeDistributor_addr,
      FEE_DISTRIBUTOR_ABI,
      feeDistributorSigner
    );

    const agentFactory = await ethers.getContractFactory(
      "FeeDistributorAgent",
      owner
    );

    agentContract = await upgrades.deployProxy(agentFactory, [
      ve_addr,
      feeDistributor_addr,
    ]);
  });

  it("should read the onchain values from the feeDistributor", async () => {
    const start_time = await feeDistributorContract.start_time();
    expect(start_time.toString()).to.be.eq("1652918400");
  });

  it("should read the onchain values from the agent", async () => {
    const WEEK = await agentContract.WEEK();
    expect(WEEK.toString()).to.be.eq("604800");
  });

  it("should return 0 for non-lockers", async () => {
    const addr = "0x1aeBc84042d8Fd415bBa14d25597B4C2748D52Eb";
    const user_epoch = await agentContract.find_timestamp_user_epoch(addr);
    expect(user_epoch.toString()).to.be.eq("0");
    const claimable = await agentContract.claimable(addr);
    expect(claimable.toString()).to.be.eq("0");
  });

  it("should return 0 if the lock didn't pass a week at least from the last claim", async () => {
    const addr = "0x6eAba52965Fab0B404bebbDA594A2BA72Bdb6288";
    const user_epoch = await agentContract.find_timestamp_user_epoch(addr);
    expect(user_epoch.toString()).to.be.eq("0");
    const claimable = await agentContract.claimable(addr);
    expect(claimable.toString()).to.be.eq("0");
  });

  it("happy1: should return value larger than 0 for the lock passed 2 weeks from the initial lock", async () => {
    const addr = "0xd1F60eBec593289daBA5F5eCba16a906f9d7A8BC";
    const user_epoch = await agentContract.find_timestamp_user_epoch(addr);
    expect(user_epoch.toString()).to.be.eq("0");
    const claimable = await agentContract.claimable(addr);
    expect(claimable.toString()).to.be.eq("46521192758994002");
  });

  it("happy2: should return value larger than 0 for the lock passed 2 weeks from the initial lock", async () => {
    const addr = "0x73055E3AF6515e1aa61679edC55ffD4bA78E3D61";
    const user_epoch = await agentContract.find_timestamp_user_epoch(addr);
    expect(user_epoch.toString()).to.be.eq("0");
    const claimable = await agentContract.claimable(addr);
    expect(claimable.toString()).to.be.eq("45356015591888722767");
  });

  it("happy3: should return value larger than 0 for the lock passed 2 weeks from the initial lock", async () => {
    const addr = "0xa53efb667BDc20B12ad98363c2E0e3d19F52B69e";
    const user_epoch = await agentContract.find_timestamp_user_epoch(addr);
    expect(user_epoch.toString()).to.be.eq("0");
    const claimable = await agentContract.claimable(addr);
    expect(claimable.toString()).to.be.eq("13484403699859920398");
  });

  it("happy4: should return value larger than 0 for the lock passed 2 weeks from the initial lock", async () => {
    const addr = "0x63FB86d77783C2e093ba3394831B8FAF3c1d241F";
    const user_epoch = await agentContract.find_timestamp_user_epoch(addr);
    expect(user_epoch.toString()).to.be.eq("0");
    const claimable = await agentContract.claimable(addr);
    expect(claimable.toString()).to.be.eq("454087294592754681");
  });
});
