import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AbiItem } from "web3-utils";
import { BidDTO } from './dto/bid.dto';
const Web3 = require('web3');
const TokenABI = require('./contracts/token.abi.json');

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/info/:address')
  async getInfo(@Param('address') address: string): Promise<string> {
    
    const web3js = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/c9cd2f00130e437a9ea32928c21f554d'));
    const contractAddress = "0xAFd335F5B92Be72DFFFad6afb4eaf0bAc32856C6";
    const contract = await new web3js.eth.Contract(TokenABI as AbiItem[], contractAddress);

    const bidsMap = await contract.methods.bidsMap(address).call();
    const totalBidders = await contract.methods.totalNrOfBidders().call();
    const expirationTime = await contract.methods.expirationTime().call();
    const expireDate = new Date(expirationTime * 1000).toLocaleString();

    const result = {
      bidsMap,
      totalBidders,
      expireDate
    };

    const jsonResult = JSON.stringify(result);

    return jsonResult;
  }

  @Post('/delegateBid')
  async delegateBid(@Body() tryparam: BidDTO ): Promise<any> {
    let bSuccess = false;
    const web3js = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/c9cd2f00130e437a9ea32928c21f554d'));
    const contractAddress = "0xAFd335F5B92Be72DFFFad6afb4eaf0bAc32856C6";
    const contract = await new web3js.eth.Contract(TokenABI as AbiItem[], contractAddress);
    const priKey = '';

    web3js.eth.accounts.wallet.add(priKey);

    const chainId = 4; // rinkeby
    const tx = contract.methods.tryBid(tryparam.to, tryparam.value, tryparam.r, tryparam.s, tryparam.v);
    const data = tx.encodeABI();

    const signedTx = await web3js.eth.accounts.signTransaction({
      from: tryparam.from,
      to: contract.address,
      data,
      gas: 300000,
      chainId: chainId
    }, String(priKey));

    try {
      await web3js.eth.sendSignedTransaction(String(signedTx))
      .once('transactionHash', function(hash){ 
      })
      .once('receipt', function(receipt){
      })
      .on('confirmation', function(confNumber, receipt){ 
      })
      .on('error', function(error){ 
      })
      .then(function(receipt){
          bSuccess = true;
      });
    } catch(error: any) {
        return false;
    }

    return bSuccess;
  }
}
