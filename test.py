import json

balance = 0
with open("./tx_track/tx/lisk_0x5785787c385de9e9298a342f4fe1de485cfb21b0.json", encoding="utf8") as file:
    data = json.load(file)
    for transfer in data:
        if transfer["TokenSymbol"] == "USDT":
            if transfer["Type"] == "OUT":
                balance += int(transfer["TokensTransferred"])
            elif transfer["Type"] == "IN":
                balance -= int(transfer["TokensTransferred"])
            else:
                print("fuck")
print(balance)