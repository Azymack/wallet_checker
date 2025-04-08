import axios from "axios";
import fs from "fs";
import { AVAX_API_KEY, AVAX_BASE_URL, AVAX_WALLETS } from "./const.js";

const BLOCK_CHUNK_SIZE = 50000;
const START_BLOCK = 39894602;
const END_BLOCK = 59894602;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function fetchAvalancheTransfers() {
  for (const address of AVAX_WALLETS) {
    const output = `./tx/avax_${address}.json`;
    const allTxs = [];
    let currentStart = START_BLOCK;

    while (currentStart < END_BLOCK) {
      const currentEnd = currentStart + BLOCK_CHUNK_SIZE;
      const url = `${AVAX_BASE_URL}?module=account&action=tokentx&address=${address}&startblock=${currentStart}&endblock=${currentEnd}&sort=asc&apikey=${AVAX_API_KEY}`;

      try {
        const res = await axios.get(url);
        const txs = res.data.result || [];

        if (txs.length) {
          console.log(txs.length);
          allTxs.push(...txs);
        } else
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

fetchAvalancheTransfers();
