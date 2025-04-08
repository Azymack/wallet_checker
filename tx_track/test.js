const axios = require("axios");
const fs = require("fs");

const API_KEY = "244VA37JA1SBIT1R7GTHHHCMD7XGHT831B";
const WALLET_ADDRESS = "0xc78f4d3f793227bc63c929d36a255277eaa68529";
const BASE_URL = "https://api-optimistic.etherscan.io/api";
const OUTPUT_FILE = "transactions.json";

async function fetchTransactions() {
  let allTransactions = [];
  let startBlock = 0;
  let endBlock = 99999999; // Fetch from the beginning
  let page = 1;
  let offset = 10000; // Max transactions per page
  let moreData = true;

  console.log("Fetching transactions...");

  while (moreData) {
    const url = `${BASE_URL}?module=account&action=txlist&address=${WALLET_ADDRESS}&startblock=${startBlock}&endblock=${endBlock}&page=${page}&offset=${offset}&sort=asc&apikey=${API_KEY}`;
    // console.log(url);
    try {
      const response = await axios.get(url);
      const txs = response.data.result;

      if (txs.length === 0) {
        moreData = false;
        break;
      }
      console.log(txs);

      allTransactions.push(...txs);
      console.log(
        `Fetched ${txs.length} transactions... (Total: ${allTransactions.length})`
      );

      page++; // Move to next page

      // To prevent API rate limits (5 requests/sec), add a delay
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error("Error fetching transactions:", error.message);
      break;
    }
  }

  // Save to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allTransactions, null, 2));
  console.log(`Saved ${allTransactions.length} transactions to ${OUTPUT_FILE}`);
}

fetchTransactions();
