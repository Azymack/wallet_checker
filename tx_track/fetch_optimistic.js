import axios from "axios";
import fs from "fs";
import {
  OPTIMISTIC_WALLETS,
  OPTIMISTIC_API_KEY,
  OPTIMISTIC_BASE_URL,
} from "./const.js";

// Block range settings (adjust based on the wallet's activity)
const BLOCK_CHUNK_SIZE = 500000; // Fetch in chunks of 500K blocks
const START_BLOCK = 119999999; // Start from genesis
const END_BLOCK = 139999999; // Until latest

const TARGET_DATE = new Date("2024-12-30").getTime() / 1000; // Convert to UNIX timestamp

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchTokenTransfers() {
  for (const WALLET_ADDRESS of OPTIMISTIC_WALLETS) {
    const OUTPUT_FILE = `./tx/optimistic_${WALLET_ADDRESS}.json`;
    console.log("Fetching token transfers for ", WALLET_ADDRESS);

    // Initialize an array to store all filtered transactions for the wallet
    const allTxs = [];

    let currentStart = START_BLOCK;

    while (currentStart < END_BLOCK) {
      let currentEnd = currentStart + BLOCK_CHUNK_SIZE;

      const url = `${OPTIMISTIC_BASE_URL}?module=account&action=tokentx&address=${WALLET_ADDRESS}&startblock=${currentStart}&endblock=${currentEnd}&sort=asc&apikey=${OPTIMISTIC_API_KEY}`;

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

        currentStart = currentEnd + 1; // Move to next block range
        await delay(200); // Prevent API rate limit
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
        break;
      }
    }

    // Write all filtered transactions to the output file as a valid JSON array
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allTxs, null, 2));
    console.log(`Filtered token transfers saved to ${OUTPUT_FILE}`);
  }
}

fetchTokenTransfers();
