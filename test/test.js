/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
const { time } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const path = require('path');

const scriptName = path.basename(__filename, '.js');
let userA, userB, userC, team;
let contract;
describe(scriptName, async () => {
  beforeEach(async () => {
    [userA, userB, userC, team] = await ethers.getSigners()
    const ETHPool = await ethers.getContractFactory('ETHPool')
    contract = await ETHPool.deploy()
    await contract.deployed()
    await contract.connect(team).registerTeam(team.address) // Registered team
  })
  it('Testing ETH balance of contract in each step', async () => {
    console.log("User A deposited 100")
    await contract.connect(userA).deposit({from:userA.address, value:100})
    expect(await ethers.provider.getBalance(contract.address)).to.equal(100);

    console.log("User B deposited 300")
    await contract.connect(userB).deposit({from:userB.address, value:300})
    expect(await ethers.provider.getBalance(contract.address)).to.equal(400);
    
    console.log("Team deposited 100")
    await contract.connect(team).deposit({from:team.address, value:100})
    expect(await ethers.provider.getBalance(contract.address)).to.equal(500);
    
    console.log("User C deposited 200")
    await contract.connect(userC).deposit({from:userC.address, value:200})
    expect(await ethers.provider.getBalance(contract.address)).to.equal(700);
    
    console.log("Passing two weeks")
    await ethers.provider.send('evm_increaseTime', [
      Number(time.duration.weeks(2)),
    ]);
    
    console.log("Team deposited 300")
    await contract.connect(team).deposit({from:team.address, value:300})
    expect(await ethers.provider.getBalance(contract.address)).to.equal(1000);
    
    console.log("Contract balance = ", await ethers.provider.getBalance(contract.address));

    await contract.connect(userA).withdraw() // Withdraw amount = 100 + 100*100/(100+300) + 300*100/(100+300+200) = 175;
    expect(await ethers.provider.getBalance(contract.address)).to.equal(825);
    
    await contract.connect(userB).withdraw() // Withdraw amount = 300 + 100*300/(100+300) + 300*300/(100+300+200) = 525;
    expect(await ethers.provider.getBalance(contract.address)).to.equal(300);

    await contract.connect(userC).withdraw() // Withdraw amount = 200 + 300*200/(100+300+200) = 300;
    expect(await ethers.provider.getBalance(contract.address)).to.equal(0);
  })

  it('Should revert if tries to deposit reward twice a week', async () => {
    await expect(
      contract.connect(team).deposit({from:team.address, value:10000000})
    ).to.not.be.reverted;
    await expect(
      contract.connect(team).deposit({from:team.address, value:10000000})
    ).to.be.revertedWith("Reward can be deposited only once a week");
  })

});
