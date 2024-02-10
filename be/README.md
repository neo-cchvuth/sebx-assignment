# SEBx Assignment Backend

## API Doc

- visit `localhost:3001/swagger`

## App Structure

- **features**: domain driven api organisation, can be nested
- shared/**guards**: app route guards
- shared/**middlewares**: app middlewares
- shared/**models**: shared classes, interfaces, constants

## How to run

- Create `.env` file from `.env.example`

#### Dev server

- Install Node.js 20

```
    > npm install
    > npm run start:dev
```

## Test

Configure `.env` to a valid MongoDB instance before running the tests

### Unit

Run `npm run test` to execute the unit tests.

### End-to-end

Run `npm run test:e2e` to execute the end-to-end tests.

### Coverage

Run `npm run test:cov` to execute the coverage tests.

## Further help

More help on [Nest](https://github.com/nestjs/nest) framework.
