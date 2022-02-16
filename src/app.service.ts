import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AbiItem } from "web3-utils";
const fs = require('fs');
const Web3 = require('web3');
const TokenABI = require('./contracts/token.abi.json');

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const web3js = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/c9cd2f00130e437a9ea32928c21f554d'));
    const contractAddress = "0xAFd335F5B92Be72DFFFad6afb4eaf0bAc32856C6";
    const contract = await new web3js.eth.Contract(TokenABI as AbiItem[], contractAddress);

    let options = {
      fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
      toBlock: 'latest'
    };

    const result = await contract.getPastEvents('Bid', options);
    fs.writeFile('bid.history.json', JSON.stringify(result), function (err) {
      if (err) return console.log(err);
      console.log('Updated history');
    });
  }
}
