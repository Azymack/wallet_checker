import os
import pandas as pd
import json

# Define the directory containing the CSV files
directory = os.path.dirname(__file__)

# List of specific CSV files to process
csv_files = [
    "token_transfers_0x5785787C385De9e9298A342F4FE1de485cfB21b0_2024-01-07_2025-04-08.csv",
    "token_transfers_0x5785787C385De9e9298A342F4FE1de485cfB21b0_2025-02-08_2025-04-08.csv",
    "token_transfers_0x5785787C385De9e9298A342F4FE1de485cfB21b0_2025-03-01_2025-04-08.csv",
    "token_transfers_0x5785787C385De9e9298A342F4FE1de485cfB21b0_2025-03-12_2025-04-08.csv",
    "token_transfers_0x5785787C385De9e9298A342F4FE1de485cfB21b0_2025-03-19_2025-04-08.csv",
]

# Prepend the directory path to each file
csv_files = [os.path.join(directory, file) for file in csv_files]

# Initialize an empty DataFrame to store merged data
merged_data = pd.DataFrame()

# Process each CSV file
for file in csv_files:
    try:
        # Read the CSV file into a DataFrame
        df = pd.read_csv(file)
        # Concatenate the current DataFrame with the merged data
        merged_data = pd.concat([merged_data, df], ignore_index=True)
    except Exception as e:
        print(f"Error reading file {file}: {e}")
print(len(merged_data))
# Drop duplicate rows, if any
merged_data = merged_data.drop_duplicates()

print(len(merged_data))


# Convert DataFrame to JSON
json_data = merged_data.to_dict(orient='records')

# Define the output JSON file name
json_file = os.path.join(directory, "merged.json")

# Write JSON data to file
with open(json_file, 'w') as f:
    json.dump(json_data, f, indent=4)

print("Specified CSV files have been merged and converted to a JSON file.")

# import os
# import pandas as pd
# import json

# # Define the directory containing the CSV files
# directory = os.path.dirname(__file__)

# # List of specific CSV files to process
# csv_files = [
#     "export-transactionserc20-0x5b7ae3c6c87F4A3F94b35c77233b13191eBFAD20.csv",
#     "export-transactionserc20-0x91090d6c03C9F2d05Db069B1729Ba45f1925517b.csv",
# ]

# # Prepend the directory path to each file
# csv_files = [os.path.join(directory, file) for file in csv_files]

# # Process each CSV file
# for file in csv_files:
#     try:
#         # Read the CSV file into a DataFrame
#         df = pd.read_csv(file)
#     except Exception as e:
#         print(f"Error reading file {file}: {e}")

#     # Convert DataFrame to JSON
#     json_data = df.to_dict(orient='records')

#     # Define the output JSON file name
#     json_file = os.path.join(directory, f"{file}merged.json")

#     # Write JSON data to file
#     with open(json_file, 'w') as f:
#         json.dump(json_data, f, indent=4)

# print("Specified CSV files have been merged and converted to a JSON file.")