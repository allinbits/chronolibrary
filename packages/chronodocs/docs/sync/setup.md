---
order: 98
outline: 'deep'
---

# Setup ChronoSync

**Prerequisites**

- Docker is required to run ChronoSync. Ensure Docker is installed on your machine before proceeding.

## Basic Setup

1. Clone or Download ChronoSync: Start by obtaining the source code for ChronoSync. You can do this by either cloning the full repository or downloading the relevant files.

```sh
git clone https://github.com/allinbits/chronolibrary
```

2. Pick your Driver, ChronoSync comes in a few different flavors for database support.

```sh
cd chronolibrary/packages/chronosync-postgres
cd chronolibrary/packages/chronosync-mongodb
cd chronolibrary/packages/chronosync-sqlite
```

3. Running the Service: Once you have the necessary files, navigate to the folder containing docker-compose.yml and run the following command:

```
docker-compose up
```

This will start ChronoSync with the necessary services.

If SQLite is used, the data will be store din a volume under `data/data.sqlite`.

To shut down the service, you can run:

```
docker-compose down
```

4. Configuration: You can modify environment variables in the docker-compose.yml file to adjust settings such as API ports or database configurations. By default, ChronoSync uses port 3939 for its REST endpoints.

Additionally, if you make any changes to the configuration of `docker-compose.yml` you can rebuild it with:

```
docker compose up --build
```

The docker file is setup in a way for data to persist between runtimes using volumes. Meaning, that you may restart your service at anytime and it will pick back up from where it left off.

