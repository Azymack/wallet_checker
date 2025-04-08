import axios from "axios";
import fs from "fs";
import { HORIZON_BASE_URL, STELLAR_WALLETS } from "./const.js";

const OUTPUT_DIR = "./tx/";

// Ensure the output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Function to introduce a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to fetch payment operations for a given Stellar account
async function fetchPaymentsForAccount(accountId) {
  let payments = [];
  let cursor = ""; // Start from the beginning
  const limit = 200; // Maximum allowed by Horizon

  while (true) {
    const url = `${HORIZON_BASE_URL}/accounts/${accountId}/payments?cursor=${cursor}&limit=${limit}&order=asc`;

    try {
      const response = await axios.get(url);
      const records = response.data._embedded.records;

      if (records.length === 0) {
        break; // No more records to fetch
      }

      payments = payments.concat(records);

      // Set cursor to the paging_token of the last record
      cursor = records[records.length - 1].paging_token;

      // Introduce a delay to respect rate limits
      await delay(200);
    } catch (error) {
      console.error(
        `Error fetching payments for account ${accountId}:`,
        error.message
      );
      break;
    }
  }

  return payments;
}

// Main function to fetch payments for all specified Stellar wallets
async function fetchAllPayments() {
  for (const accountId of STELLAR_WALLETS) {
    console.log(`Fetching payments for account: ${accountId}`);

    const payments = await fetchPaymentsForAccount(accountId);

    const outputFile = `${OUTPUT_DIR}stellar_${accountId}.json`;
    fs.writeFileSync(outputFile, JSON.stringify(payments, null, 2));

    console.log(`Payments saved to ${outputFile}`);
  }
}

// Execute the script
fetchAllPayments();
