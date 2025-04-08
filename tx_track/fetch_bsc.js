import axios from "axios";
import fs from "fs";
import { BSC_WALLETS, BSC_BASE_URL, BSC_API_KEY } from "./const.js";

// Block range settings (adjust based on the wallet's activity)
const BLOCK_CHUNK_SIZE = 50000; // Fetch in chunks of 50,000 blocks
const START_BLOCK = 31175460; // Start from the first block
const END_BLOCK = 48175460; // Latest block as of now

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchTokenTransfers() {
  for (const WALLET_ADDRESS of BSC_WALLETS) {
    const OUTPUT_FILE = `./tx/bsc_${WALLET_ADDRESS}.json`;
    console.log("Fetching token transfers for", WALLET_ADDRESS);

    // Initialize an array to store all transactions for the wallet
    const allTxs = [];

    let currentStart = START_BLOCK;

    while (currentStart <= END_BLOCK) {
      let currentEnd = Math.min(currentStart + BLOCK_CHUNK_SIZE - 1, END_BLOCK);

      const url = `${BSC_BASE_URL}?module=account&action=tokentx&address=${WALLET_ADDRESS}&startblock=${currentStart}&endblock=${currentEnd}&sort=asc&apikey=${BSC_API_KEY}`;

      try {
        const response = await axios.get(url);
        const txs = response.data.result;

        if (txs && txs.length > 0) {
          allTxs.push(...txs);
        } else {
          console.log(
            `No transactions found in block range ${currentStart} to ${currentEnd}`
          );
        }

        currentStart = currentEnd + 1; // Move to the next block range
        await delay(200); // Prevent API rate limit
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
        break;
      }
    }

    // Write all transactions to the output file as a JSON array
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allTxs, null, 2));
    console.log(`Token transfers saved to ${OUTPUT_FILE}`);
  }
}

fetchTokenTransfers();
