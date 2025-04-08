const axios = require("axios");

// TONscan API endpoint
const apiUrl = "https://tonscan.org/api/v1/transactions";

// Replace with the wallet address you want to monitor
const walletAddress = "UQBdC3HxqmyH-MvKH640BsD4HnwUGAoEQvrcTxlskM7AAcy2";

// Function to fetch transactions
async function fetchTransactions() {
  try {
    const response = await axios.get(apiUrl, {
      params: {
        address: walletAddress,
      },
    });
    const transactions = response.data;
    console.log("Transactions:", transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
}

// Call the function to fetch transactions
fetchTransactions();
