import axios from "axios";
import fs from "fs";
import { BASE_WALLETS, BASE_BASE_URL, BASE_API_KEY } from "./const.js";

const BLOCK_CHUNK_SIZE = 50000;
const START_BLOCK = 3628279; // Adjust depending on historical need
const END_BLOCK = 28628228; // Current block height as of April 2025

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchBaseTokenTransfers() {
  for (const WALLET_ADDRESS of BASE_WALLETS) {
    const OUTPUT_FILE = `./tx/base_${WALLET_ADDRESS}.json`;
    console.log("Fetching Base token transfers for", WALLET_ADDRESS);

    const allTxs = [];
    let currentStart = START_BLOCK;

    while (currentStart < END_BLOCK) {
      const currentEnd = currentStart + BLOCK_CHUNK_SIZE;
      const url = `${BASE_BASE_URL}?module=account&action=tokentx&address=${WALLET_ADDRESS}&startblock=${currentStart}&endblock=${currentEnd}&sort=asc&apikey=${BASE_API_KEY}`;

      try {
        const response = await axios.get(url);
        const txs = response.data.result;

        if (txs && txs.length > 0) {
          allTxs.push(...txs);
        } else {
          console.log(
            `No transactions in blocks ${currentStart} to ${currentEnd}`
          );
        }

        currentStart = currentEnd + 1;
        await delay(200);
      } catch (error) {
        console.error("Error fetching from BaseScan:", error.message);
        break;
      }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allTxs, null, 2));
    console.log(`Saved to ${OUTPUT_FILE}`);
  }
}

fetchBaseTokenTransfers();
