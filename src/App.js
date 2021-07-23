import logo from './logo.svg';
import './App.css';
// import {Biconomy} from "@biconomy/mexa";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';
// Extra Dependencies
import abi from "ethereumjs-abi";
import {toBuffer} from "ethereumjs-util";
import CONTRACT_ABI from "./abi.json"
import { Order, Asset, sign } from "./order"
import { id, ETH, ERC20, ERC721, ERC1155, ORDER_DATA_V1, TO_MAKER, TO_TAKER, PROTOCOL, ROYALTY, ORIGIN, PAYOUT, enc } from "./assets"

function App() {
  
  raribleBuy()

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

const raribleBuy = async () => {
    const ZERO = "0x0000000000000000000000000000000000000000";
  
  let sellOrder = {
      "type": "RARIBLE_V2",
      "maker": "0xeb09a1a4d49046fe48b981d111553d5a2b26f074",
      "make": {
        "assetType": {
          "assetClass": "ERC721",
          "contract": "0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7",
          "tokenId": "13773"
        },
        "value": "1"
      },
      "take": {
        "assetType": {
          "assetClass": "ETH"
        },
        "value": "3000000000000000000"
      },
      "fill": "0",
      "makeStock": "1",
      "cancelled": false,
      "salt": "0x945e155b8fbc7105540c41f96714f4df5383dbf7a4685e0232599608dbe10aa4",
      "data": {
        "dataType": "RARIBLE_V2_DATA_V1",
        "payouts": [],
        "originFees": [
          {
            "account": "0x1cf0df2a5a20cd61d68d4489eebbf85b8d39e18a",
            "value": 250
          }
        ]
      },
      "signature": "0xf6db89288caeb6d06bc0480ddd07e3d5e21bcbff397800181bb5314c363127ba6b7e1646fb2b9d30e157784d4ed1f3cbad5aba3315f5ea7acf61066ea02db29501",
      "createdAt": "2021-07-22T12:56:28Z",
      "lastUpdateAt": "2021-07-22T12:56:28Z",
      "pending": [],
      "hash": "0xaf43bde64013c4938ce0dbb295413cf944ec99770006880433ad2c3595e02757",
      "makeBalance": "0",
      "makePriceUsd": 5910.904357100123
  }
  

  const API_KEY = "p8AUzzM2I.5ed0d8d2-e374-4f10-a9be-5fb6c0f5cc0d"
  const CONTRACT_ADDR = "0xBF3c3B8C9afA1F719E6a79CA1A2a2a05fB80c75d"
  // const RPC = "https://rinkeby.infura.io/v3/2cf3ec9bd42d4099b8620c2a6ee8c51a"
  // This function detects most providers injected at window.ethereum

  if (typeof window.ethereum !== 'undefined') {    
    // const provider = await detectEthereumProvider();
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    let provider = await window.web3.currentProvider
    let web3 = new Web3(provider);

    // { maker, makeAsset, taker, takeAsset, salt, start, end, dataType, data }
    const right = Order(
      "0x073Ab1C0CAd3677cDe9BDb0cDEEDC2085c029579",
      Asset(ERC721, enc(web3, "0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7", 13773), 1),
      ZERO,
      Asset(ETH, "0x", "3000000000000000000"),
      "0x945e155b8fbc7105540c41f96714f4df5383dbf7a4685e0232599608dbe10aa4",
      0,
      0,
      "0xffffffff",
      "0x"
    );
    const left = Order(
      "0x073Ab1C0CAd3677cDe9BDb0cDEEDC2085c029579",
      Asset(ETH, "0x", "3000000000000000000"),
      "0xeb09a1a4d49046fe48b981d111553d5a2b26f074",
      Asset(ERC721, enc(web3, "0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7", 13773), 1),
      "0x945e155b8fbc7105540c41f96714f4df5383dbf7a4685e0232599608dbe10aa4",
      0,
      0,
      "0xffffffff",
      "0x"
    );

    let signatureLeft = await getSignature(web3, left, "0x073Ab1C0CAd3677cDe9BDb0cDEEDC2085c029579");
    console.log(signatureLeft)

    let signatureRight = await getSignature(web3, right, "0x073Ab1C0CAd3677cDe9BDb0cDEEDC2085c029579");
    console.log(signatureRight)

    var myContract = new web3.eth.Contract(CONTRACT_ABI, '0x1e1B6E13F0eB4C570628589e3c088BC92aD4dB45', {
        from: '0x073Ab1C0CAd3677cDe9BDb0cDEEDC2085c029579', // default from address
    });

    myContract.methods.matchOrders(
      left,
      signatureLeft,
      right,
      signatureLeft
    ).send({ from: '0x073Ab1C0CAd3677cDe9BDb0cDEEDC2085c029579' })
      .then(function (receipt) {
      console.log(receipt)
        // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
    })
  }
  else {
    console.error('Please install MetaMask');
  }
}

const getSignature = async (web3, order, signer) => {
		return sign(web3, order, signer, "0x1e1B6E13F0eB4C570628589e3c088BC92aD4dB45");
}

export default App;
