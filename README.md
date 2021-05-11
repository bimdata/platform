# BIMData Platform, next generation

> **Important Note**
>
> This project is the next generation BIMData platform.
> It is still under development and we do not intend to provide any support
> on this project for now.
>
> If you want to fork/work/give feedback on BIMData platform please go to the [currently
> supported version](https://github.com/bimdata/platform).

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
$ npm run dev
```

- **(5)** Have a coffee and start coding... :coffee: `</>`

## Test

This project comes with a set of end-to-end tests built with [Cypress](https://www.cypress.io/).

Before you can run the tests you need to set Cypress environment variables.
To do so copy the example env file:

```
$ cp cyress.env.example cypress.env.json
```

Then open it and set variables values as appropriate.

Once you setup Cypress env vars run the tests using the following command:

```
$ npm run test:e2e
```

This command will start the platform locally on port `3030` and open Cypress.

## Documentation

Coming soon...

## License

The content of this repository is published under the terms of the [GNU LGPL-3.0](./LICENSE).

> You are free to copy, modify, and distribute BIMData Platform under the terms of the LGPL 3.0.  
> See LICENSE for more details.
