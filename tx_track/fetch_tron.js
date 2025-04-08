import axios from "axios";
import fs from "fs";
import { TRON_BASE_URL, TRON_WALLETS } from "./const.js";

// Function to introduce delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to fetch TRC20 transfers
async function fetchTRC20Transfers() {
  for (const WALLET_ADDRESS of TRON_WALLETS) {
    const OUTPUT_FILE = `./tx/tron_${WALLET_ADDRESS}.json`;
    console.log(`Fetching TRC20 transfers for ${WALLET_ADDRESS}`);

    let trc20Transfers = [];
    let start = 0;
    const limit = 50; // Number of transactions per request

    while (true) {
      const url = `${TRON_BASE_URL}/token_trc20/transfers?relatedAddress=${WALLET_ADDRESS}&start=${start}&limit=${limit}`;

      try {
        const response = await axios.get(url);
        const transfers = response.data.token_transfers;

        if (transfers && transfers.length > 0) {
          trc20Transfers.push(...transfers);
          start += limit;
        } else {
          console.log(`No more TRC20 transfers found for ${WALLET_ADDRESS}`);
          break;
        }

        await delay(200); // Prevent hitting rate limits
      } catch (error) {
        console.error(
          `Error fetching TRC20 transfers for ${WALLET_ADDRESS}:`,
          error.message
        );
        break;
      }
    }

    // Write TRC20 transactions to the output file as a valid JSON object
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(trc20Transfers, null, 2));
    console.log(`TRC20 transfers saved to ${OUTPUT_FILE}`);
  }
}

fetchTRC20Transfers();
