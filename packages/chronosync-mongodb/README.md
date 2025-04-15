# ChronoSync MongoDB

This is a mini-indexer that parses feed data and inserts it into the database.

This simply takes prefixes and pushes the actions to the database.

## Tech

- MongoDB
- ChronoState

**Docker is required** to easily spin up and tear down this service.

## Usage

```
docker-compose up
```

```
docker-compose down
```

Environment variables can be modified inside of `docker-compose.yml`

## Local Development

If you're trying to build locally, starting the docker container with the command below ensures everything is rebuilt each time.

```
docker compose up --build
```