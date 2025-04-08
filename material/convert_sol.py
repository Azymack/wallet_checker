import csv
import json

# Input and output file paths
input_csv_file = 'export_transfer_ENEAm2LBMT76BriE1GhHs2yvCMJuDgqF3Zn49Q4jb3DG_1743901422207.csv'
output_json_file = 'export_transfer.json'

# Read the CSV file and convert it to JSON
data = []
with open(input_csv_file, mode='r', encoding='utf-8') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    for row in csv_reader:
        data.append(row)

# Write the JSON data to a file
with open(output_json_file, mode='w', encoding='utf-8') as json_file:
    json.dump(data, json_file, indent=4)

print(f"CSV data has been successfully converted to JSON and saved to {output_json_file}.")