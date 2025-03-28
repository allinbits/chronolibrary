---
order: 98
outline: 'deep'
---

# Setup TemporaSync

**Prerequisites**

- Docker is required to run TemporaSync. Ensure Docker is installed on your machine before proceeding.

## Basic Setup

1. Clone or Download TemporaSync: Start by obtaining the source code for TemporaSync. You can do this by either cloning the full repository or downloading the relevant files.

```sh
git clone https://github.com/allinbits/temporalib
```

```sh
cd temporalib/packages/temporasync
```

2. Running the Service: Once you have the necessary files, navigate to the folder containing docker-compose.yml and run the following command:

```
docker-compose up
```

This will start TemporaSync with the necessary services. The data will be stored in the data folder under `temporasync` as data.sqlite.

To shut down the service, you can run:

```
docker-compose down
```

3. Configuration: You can modify environment variables in the docker-compose.yml file to adjust settings such as API ports or database configurations. By default, TemporaSync uses port 3939 for its REST endpoints.

Additionally, if you make any changes to the configuration of `docker-compose.yml` you can rebuild it with:

```
docker compose up --build
```

The docker file is setup in a way for data to persist between runtimes using volumes. Meaning, that you may restart your service at anytime and it will pick back up from where it left off.

