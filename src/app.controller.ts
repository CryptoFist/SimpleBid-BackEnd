import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AbiItem } from "web3-utils";
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
  delegateBid(): string {
    return "delegate Bid";
  }
}
