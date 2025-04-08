import axios from "axios";
import fs from "fs";
import { CELO_WALLETS, CELO_BASE_URL, CELO_API_KEY } from "./const.js";

// Block range settings (adjust based on the wallet's activity)
const BLOCK_CHUNK_SIZE = 1000; // Fetch in chunks of 50,000 blocks
const START_BLOCK = 25056500; // Start from a specific block number
const END_BLOCK = 32056500; // Until the latest block

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchTokenTransfers() {
  for (const WALLET_ADDRESS of CELO_WALLETS) {
    const OUTPUT_FILE = `./tx/celo_${WALLET_ADDRESS}.json`;
    console.log("Fetching transactions for", WALLET_ADDRESS);

    // Initialize the output file
    fs.writeFileSync(OUTPUT_FILE, "[\n");

    let currentStart = START_BLOCK;
    let isFirstChunk = true;

    while (currentStart < END_BLOCK) {
      let currentEnd = currentStart + BLOCK_CHUNK_SIZE;

      const url = `${CELO_BASE_URL}?module=account&action=tokentx&address=${WALLET_ADDRESS}&startblock=${currentStart}&endblock=${currentEnd}&sort=asc&apikey=${CELO_API_KEY}`;

      console.log(url);
      try {
        const response = await axios.get(url);
        const txs = response.data.result;

        if (txs && txs.length > 0) {
          // Append transactions to the output file
          const txData = JSON.stringify(txs, null, 2);
          if (!isFirstChunk) {
            fs.appendFileSync(OUTPUT_FILE, ",\n");
          }
          fs.appendFileSync(OUTPUT_FILE, txData.slice(1, -1)); // Remove array brackets
          isFirstChunk = false;
        } else {
          console.log(
            `No transactions found in block range ${currentStart} to ${currentEnd}`
          );
        }

        currentStart = currentEnd + 1; // Move to the next block range
        await delay(200); // Prevent API rate limiting
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
        break;
      }
    }

    // Close the JSON array in the output file
    fs.appendFileSync(OUTPUT_FILE, "\n]");
    console.log(`Transactions saved to ${OUTPUT_FILE}`);
  }
}

fetchTokenTransfers();
