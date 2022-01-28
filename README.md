# Jamming API v1.0 - Marco Vignotto

## The challenge

Challenge made in a few hours to create a Jamming API whrere a user can host a jam session and other users (guests) can join.

## Note

_Just_ for testing purposes the `.env` file and credentials in **Docker** are attached. The app works just with local **MongoDb** and **Docker container**.

The _app_ can run locally or with **Docker**, a **Postman** collection is attached and is testable with **Jest**.

_Testing specs_ at the bottom of the README.

## Process

The app is developed in **TDD**, a bit of refactoring to optimize the code was made once everything was working correctly.

## Technologies

- Nest.js
- MongoDb / Mongoose
- Json Web Token
- Jest
- Swagger

# Specs

## General

- port 5000

## Routes

`localhost:5000/v1/users`

`localhost:5000/v1/jams`

`localhost:5000/v1/auth`

## Docs

http://localhost:5000/api-docs/

# How To

The _app_ can run locally or with **Docker**.

## Requirements

- Node.js
- MongoDb (local installation)
- port 5000

## Locally

`npm i`

From production to development changes the _db_ alone

`npm run start` is `mongodb://localhost/jamming`

`npm run start:dev` is `mongodb://localhost/jammingTest`

# Docker

Docker has `dev` and `prod`

### `dev`

`npm run docker:dev`

uses the **_Docker_ Mongodb** accessible with **Mongo Express** on `:8081`

From inside `dev` is possible to run the tests.

### `prod`

`npm run docker:prod`

uses the local **MongoDb** of the running machine: `mongodb://localhost/jamming`

# Testing

## Postman

`__postman___` contains a **Postman** collection, the requests have the same users/jams used as _stubs_ with **Jest**.
With the collection is possible to perform all the CRUD operations of the app.

## Jest

Every route contains its _unit test_ and _mocks_. All the tests are sharing the same _stubs_ (users, jams).

**NOTE:** by default all the **e2e tests** are disabled.

`/e2eTests` contains all the **e2e tests**, `all.e2e.spec.ts` has all the tests.

Just for the challenge, I divided the tests by route, every test is performing all the CRUD operations on the specific route.

`jams.users.spec.ts` creates the users for `jams.crud.spec.ts` that performs all the operations (it's divided in 2 different parts)

**NOTE:** by default `jams.users.spec.ts` does not delete the users

The tests can be perfomed from **Docker dev**

### Example for a CRUD operation in `/jams`

`npm run test:watch`

remove skip from `jams.users.spec.ts`

`jest` creates the 5 users

remove skip from `jams.crud.spec.ts`

`jest` will perform a complete CRUD flow in `/jams`
