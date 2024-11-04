# BIMData Platform

This repository host the BIMData Platform project.
The Platform is a Vue 3.x application bundled with [Vite](https://vitejs.dev/).

## Pre-requisites

You need:

- Node v14+
- Vue 3.x
- [see platform-back for backend requirements](https://github.com/bimdata/platform-back)

## Install & Run :arrow_down: :runner:

### Backend setup

In order for the platform to work properly it should be able to interact with its backend service.
The [platform-back](https://github.com/bimdata/platform-back) repository host the source code of the service.

The backend is a python app built with [Django REST framework](https://www.django-rest-framework.org/).<br/>
You should refer to its [README](https://github.com/bimdata/platform-back) to set it up on your development
environment before moving to the application setup.

### Application setup

Here are the instructions to get the platform up and running on your development environment:

- **(1)** Get the sources

```
$ git clone git@github.com:bimdata/platform.git
$ cd platform/
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

## Tests :passport_control: :white_check_mark:

This project comes with a set of end-to-end tests built with [Cypress](https://www.cypress.io/).

Before you can run the tests you need to have a working test environment.
To do so copy the example env file:

```
$ cp cyress.env.json.example cypress.env.json
```

Then open it and set variables values as appropriate:

- **APP_BASE_URL**: will be used by Cypress as [baseUrl](https://docs.cypress.io/guides/references/configuration#e2e)
- **AUTH_BASE_URL**: authentication server
- **IAM_BASE_URL**: identity server

Start the platform locally (only needed if your **APP_BASE_URL** point to `localhost`):

```
npm run dev
```

Finally start and open Cypress using the following command:

```
$ npm run test:e2e
```

#### :point_up: Important Note

In order for the tests to work properly you **must** run the [setup tests](./tests/e2e/specs/setup/setup.cy.js) first.
This will create random test users that will be used in all other tests.

Once your tests are completed you can run the [teardown tests](./tests/e2e/specs/teardown/teardown.cy.js) to delete tests users.

## Build :package:

The platform can be built for production like environment using the following command:

```
$ npm run build
```

This will create a `dist/` directory that contain the bundled application ready to be deployed.

## Development process

There are 3 process banches: `develop`, `release` and `master`.

`develop` is the main development branch. All feature branches should be merged into `develop` using pull requests.
`release` is the pre-production branch. All fix branches should be merged into `release` using pull requests. The release branch must be merged into `develop` once a PR is merged.
`master` is the production branch. The release branch must be merged into `master` once a release is ready.

This setup allows us to have unsable features in develop while to blocking fix to be shipped in production.

### BIMData Viewer

When a new version of the Viewer is released, the `develop` branch is automatically updated to use this version.
When a new stable version of the Viewer is released, the `release` branch is automatically updated to use this version.

## License

The content of this repository is published under the terms of the [GNU LGPL-3.0](./LICENSE).

> You are free to copy, modify, and distribute BIMData Platform under the terms of the LGPL 3.0.<br/>
> See LICENSE for more details.
