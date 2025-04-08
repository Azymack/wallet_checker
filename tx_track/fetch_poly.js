import axios from "axios";
import fs from "fs";
import { POLY_API_KEY, POLY_BASE_URL, POLY_WALLETS } from "./const.js";

const BLOCK_CHUNK_SIZE = 50000;
const START_BLOCK = 50032632;
const END_BLOCK = 70032632;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function fetchPolygonTransfers() {
  for (const address of POLY_WALLETS) {
    const output = `./tx/polygon_${address}.json`;
    const allTxs = [];
    let currentStart = START_BLOCK;

    while (currentStart < END_BLOCK) {
      const currentEnd = currentStart + BLOCK_CHUNK_SIZE;
      const url = `${POLY_BASE_URL}?module=account&action=tokentx&address=${address}&startblock=${currentStart}&endblock=${currentEnd}&sort=asc&apikey=${POLY_API_KEY}`;

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

fetchPolygonTransfers();
