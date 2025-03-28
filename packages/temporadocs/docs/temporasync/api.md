---
order: 97
outline: 'deep'
---

# API TemporaSync

TemporaSync provides several endpoints to help you query event data from the blockchain. Below are the available endpoints and sample responses.

## /health

Ensure the service is running properly by checking the health of the system.

**Query**

```
GET http://localhost:3939/health
```

**Response**

```json
{
  "status": "ok"
}
```

## /data - Query Memos

You can query all actions with pagination with limited results.

**Query**

```
GET http://localhost:3939/data?offset=0&limit=100
```

**Response**

```
{
  "data": [
    {
      "hash": "cb196...",
      "height": "2403476",
      "timestamp": "2025-03-27T21:03:43.433465009Z",
      "from_address": "atone...",
      "to_address": "atone...",
      "memo": "0xTest",
      "amounts": [
        {
          "denom": "uatone",
          "amount": "1"
        }
      ]
    }
  ],
  "total": 1,
  "limit": 100,
  "offset": 0
}
```

## /data - Query Between Blocks

If you're interested in querying events between specific block heights, you can use the min and max parameters.

**Query**

```
GET http://localhost:3939/data?offset=0&min=2403475&max=2403476
```

**Response**

```
{
  "data": [
    {
      "hash": "cb196...",
      "height": "2403476",
      "timestamp": "2025-03-27T21:03:43.433465009Z",
      "from_address": "atone...",
      "to_address": "atone...",
      "memo": "0xTest",
      "amounts": [
        {
          "denom": "uatone",
          "amount": "1"
        }
      ]
    },
    {
      "hash": "c15aa...",
      "height": "2403921",
      "timestamp": "2025-03-27T21:47:03.051696731Z",
      "from_address": "atone...",
      "to_address": "atone...",
      "memo": "",
      "amounts": [
        {
          "denom": "uatone",
          "amount": "200000"
        }
      ]
    }
  ],
  "total": 2,
  "limit": 100,
  "offset": 0
}
```

## /last - Query Last Block

This endpoint provides information about the last processed block in the system.

**Query**

```
GET http://localhost:3939/last
```

**Response**

```
{
  "lastBlock": "2403945"
}
```
