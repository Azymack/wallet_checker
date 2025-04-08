import axios from "axios";
import fs from "fs";
import { ARB_API_KEY, ARB_BASE_URL, ARB_WALLETS } from "./const.js";

const BLOCK_CHUNK_SIZE = 500000;
const START_BLOCK = 213966978;
const END_BLOCK = 323966978;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function fetchArbitrumTransfers() {
  for (const address of ARB_WALLETS) {
    const output = `./tx/arbitrum_${address}.json`;
    const allTxs = [];
    let currentStart = START_BLOCK;

    while (currentStart < END_BLOCK) {
      const currentEnd = currentStart + BLOCK_CHUNK_SIZE;
      const url = `${ARB_BASE_URL}?module=account&action=tokentx&address=${address}&startblock=${currentStart}&endblock=${currentEnd}&sort=asc&apikey=${ARB_API_KEY}`;

      try {
        const res = await axios.get(url);
        const txs = res.data.result || [];

        if (txs.length) allTxs.push(...txs);
        else
          console.log(
            `No txs for ${address} from ${currentStart} to ${currentEnd}`
          );

        currentStart = currentEnd + 1;
        await delay(200);
      } catch (err) {
        console.error("Error:", err.message);
        break;
      }
    }

    fs.writeFileSync(output, JSON.stringify(allTxs, null, 2));
    console.log(`Saved to ${output}`);
  }
}

fetchArbitrumTransfers();
