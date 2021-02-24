# BIMData Platform, next generation

This repository host the BIMData Platform project.
The Platform is a Vue 3.x application created with [Vue CLI](https://cli.vuejs.org/).

## Install & Run

Here are the instructions to get the platform up and running on your
development environment:

- **(1)** Get the sources

```
$ git clone git@github.com:bimdata/platform-next.git
$ cd platform-next/
```

- **(2)** Install dependencies

```
$ npm install
```

- **(3)** Setup local env

```
$ cp .env.example .env.local
```

Open `.env.local` with your favorite text editor and set the variable `VUE_APP_OIDC_CLIENT_ID`
to one of your client ID.
If you don't know what a _"client ID"_ is then you should have a look at
[the documentation](https://developers.bimdata.io/api/guides/application.html#create-your-application)
and follow the steps to create an application.

- **(4)** Run the platform

```
$ npm run serve
```

- **(5)** Make you a coffee and start coding... :coffee: `</>`

## Documentation

Coming soon...
