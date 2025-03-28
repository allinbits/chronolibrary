# TemporaSync

Powered by elysia, this software provides REST endpoints for querying memos as they are processed.

A basic configuration will begin processing blocks from APIs, and construct event history given a preifxed memo.

## Tech

- NodeJS
- SQLite
- Elysia

**Docker is required** to easily spin up and tear down this service.

## Usage

Keep in mind that when building the `data.sqlite` file will automatically be copied over if present.

```
docker-compose up
```

```
docker-compose down
```

Environment variables can be modified inside of `docker-compose.yml`

Additionally, all  SQLite data is stored inside of the `data` folder.

## Endpoints

**Query**

```
http://localhost:3939/health
```

**Response**

```json
{
  "status":"ok"
}
```

### Query All Actions

**Query**

```
http://localhost:3939/data?offset=0&limit=100
```

**Response**

```json
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
  "total": 2,
  "limit": 100,
  "offset": 0
}
```

### Query Between Blocks

**Query**

```
http://localhost:3939/data?offset=0&min=2403475&max=2403476
```

**Response**

```json
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

### Query Last Block

**Query**

```
http://localhost:3939/last
```

**Response**

```json
{
  "lastBlock":"2403945"
}
```

## Local Development

If you're trying to build locally, starting the docker container with the command below ensures everything is rebuilt each time.

```
docker compose up --build
```