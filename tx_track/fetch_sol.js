import axios from "axios";
import fs from "fs";
import { SOL_API_KEY, SOL_BASE_URL, SOL_WALLETS } from "./const.js";

// Function to introduce delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to fetch token transfers
async function fetchTokenTransfers() {
  for (const WALLET_ADDRESS of SOL_WALLETS) {
    const OUTPUT_FILE = `./tx/sol_${WALLET_ADDRESS}.json`;
    console.log(`Fetching token transfers for ${WALLET_ADDRESS}`);

    let allTxs = [];
    let page = 1;
    const pageSize = 100; // Maximum allowed page size

    while (true) {
      const url = `${SOL_BASE_URL}?address=${WALLET_ADDRESS}&page=${page}&page_size=${pageSize}&sort_by=block_time&sort_order=asc`;

      try {
        const response = await axios.get(url, {
          headers: { token: SOL_API_KEY },
        });

        const txs = response.data.data;

        if (txs && txs.length > 0) {
          allTxs.push(...txs);
          page++;
        } else {
          console.log(`No more transactions found for ${WALLET_ADDRESS}`);
          break;
        }

        await delay(1000); // Prevent hitting rate limits
      } catch (error) {
        console.error(
          `Error fetching transactions for ${WALLET_ADDRESS}:`,
          error.message
        );
        break;
      }
    }

    // Write all transactions to the output file as a valid JSON array
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allTxs, null, 2));
    console.log(`Token transfers saved to ${OUTPUT_FILE}`);
  }
}

fetchTokenTransfers();
