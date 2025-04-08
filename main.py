import json
import os
from datetime import datetime

# Folder path
folder_path = './tx_track/tx'

# Define the cutoff date
# cutoff_timestamp = 1735689599  # 12/31/2024 23:59:59
cutoff_timestamp = 1735685999 # EST

# Read and process all JSON files in the folder
try:
    results = []

    for file_name in os.listdir(folder_path):
        if file_name.endswith('.json'):
            file_path = os.path.join(folder_path, file_name)
            with open(file_path, 'r', encoding="utf8") as file:
                chain = file_path.split("_")[1].split("\\")[1]
                print(chain, "-------------------")
                target_address = file_path.split("_")[2].split(".")[0]
                # Load contract addresses from contract_address.json
                with open('contract_address.json', 'r') as contract_file:
                    contract_addresses = json.load(contract_file)

                # Get the relevant contract addresses for the chain
                if chain in contract_addresses:
                    chain_contracts = contract_addresses[chain]
                else:
                    print(f"No contract addresses found for chain: {chain}")
                    continue
                print(chain, target_address)
                data = json.load(file)
                for coin, contract_address in chain_contracts.items():
                    print(coin, contract_address)
                    balance = 0
                    filtered_balance = 0
                    for transfer in data:
                        if chain.lower() == "tron":
                            if transfer["contract_address"].lower() == contract_address.lower():
                                if transfer["to_address"].lower() != transfer["from_address"].lower():
                                    if int(transfer["block_ts"]) / 1000 < cutoff_timestamp:
                                        if transfer["to_address"].lower() == target_address.lower():
                                            filtered_balance += int(transfer["quant"])
                                        elif transfer["from_address"].lower() == target_address.lower():
                                            filtered_balance -= int(transfer["quant"])
                                    if transfer["to_address"].lower() == target_address.lower():
                                        balance -= int(transfer["quant"])
                                    elif transfer["from_address"].lower() == target_address.lower():
                                        balance += int(transfer["quant"])
                                else:
                                    print("fuck")
                        elif chain.lower() == "sol":
                            if transfer["TokenAddress"].lower() == contract_address.lower():
                                if transfer["To"].lower() != transfer["From"].lower():
                                    if int(transfer["Time"]) < cutoff_timestamp:
                                        if transfer["To"].lower() == target_address.lower():
                                            filtered_balance += int(transfer["Amount"])
                                        elif transfer["From"].lower() == target_address.lower():
                                            filtered_balance -= int(transfer["Amount"])
                                    if transfer["To"].lower() == target_address.lower():
                                        balance -= int(transfer["Amount"])
                                    elif transfer["From"].lower() == target_address.lower():
                                        balance += int(transfer["Amount"])
                                else:
                                    print("fuck")
                        elif chain.lower() == "lisk":
                            if transfer["TokenContractAddress"].lower() == contract_address.lower():
                                if transfer["ToAddress"].lower() != transfer["FromAddress"].lower():
                                    if int(datetime.strptime(transfer["UnixTimestamp"], "%Y-%m-%d %H:%M:%S.%fZ").timestamp()) < cutoff_timestamp:
                                        if transfer["ToAddress"].lower() == target_address.lower():
                                            filtered_balance += int(transfer["TokensTransferred"])
                                        elif transfer["FromAddress"].lower() == target_address.lower():
                                            filtered_balance -= int(transfer["TokensTransferred"])
                                    if transfer["ToAddress"].lower() == target_address.lower():
                                        balance -= int(transfer["TokensTransferred"])
                                    elif transfer["FromAddress"].lower() == target_address.lower():
                                        balance += int(transfer["TokensTransferred"])
                                else:
                                    print("fuck")
                        else:
                            if transfer["contractAddress"].lower() == contract_address.lower():
                                if transfer["to"].lower() != transfer["from"].lower():
                                    if int(transfer["timeStamp"]) < cutoff_timestamp:
                                        if transfer["to"].lower() == target_address.lower():
                                            filtered_balance += int(transfer["value"]) 
                                        elif transfer["from"].lower() == target_address.lower():
                                            filtered_balance -= int(transfer["value"])
                                    if transfer["to"].lower() == target_address.lower():
                                        balance -= int(transfer["value"])
                                    elif transfer["from"].lower() == target_address.lower():
                                        balance += int(transfer["value"])
                    # Save the result for this file
                    results.append({
                        "target_address": target_address,
                        "chain": chain,
                        "coin": coin,
                        "balance": balance,
                        "filtered_balance": filtered_balance
                    })

    # Save all results to a JSON file
    with open('calculation_results.json', 'w') as result_file:
        json.dump(results, result_file, indent=4)
    
    print(f"Final balance for {target_address}: {balance}")
    
    print(f"Final balance for {target_address}: {balance}")
except FileNotFoundError:
    print(f"Folder not found: {folder_path}")
except json.JSONDecodeError:
    print("Error decoding JSON file.")
except KeyError as e:
    print(f"Missing key in JSON data: {e}")