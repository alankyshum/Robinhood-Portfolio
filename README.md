# Robinhood Portfolio
> Simply returns your Robinhood portfolio, with stock symbols, stock full name, and average buy price

## Example
1. Create/Edit the `.env` to supply the robinhood access token
```bash
ROBINHOOD_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
2. run `spec/example.js` and check the output

### Example output
```json
{
  "RHT": {
    "name": "Red Hat Inc",
    "country": "US",
    "instrumentURL": "https://api.robinhood.com/instruments/73f0b448-ac9c-49c6-b281-ef28aa51fd3f/",
    "quantity": 9,
    "averagePrice": 121.5000
  },
  "FB": {
    "name": "Facebook, Inc. - Class A Common Stock",
    "country": "US",
    "instrumentURL": "https://api.robinhood.com/instruments/ebab2398-028d-4939-9f1d-13bf38f81c50/",
    "quantity": 6,
    "averagePrice": 178.0000
  },
  "AMD": {
    "name": "Advanced Micro Devices, Inc. Common Stock",
    "country": "US",
    "instrumentURL": "https://api.robinhood.com/instruments/940fc3f5-1db5-4fed-b452-f3a2e4562b5f/",
    "quantity": 220,
    "averagePrice": 10.7000
  },
  "BZUN": {
    "name": "Baozun Inc. American Depositary Shares",
    "country": "CN",
    "instrumentURL": "https://api.robinhood.com/instruments/24589df6-1a0a-4440-b8c4-d533ba53c3c8/",
    "quantity": 70,
    "averagePrice": 33.3757
  }
}
```

## Versioning
The versioning of this package follows semantic versioning `MAJOR.MINOR.PATCH`.

## References

### Unofficial Documentation of Robinhood Trade's Private API
https://github.com/sanko/Robinhood/blob/ef63649f5d316e10f672c4d588a79cf0387c97df/README.md
