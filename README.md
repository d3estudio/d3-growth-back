# d3-growth-back

the target is to build an awesome tool that can help the growth process.

## tech

this api is being built with these technologies:

- node 12.10.0
- mongodb 4.2.0
- docker

## roadmap

- [x] retrieve all customers answers from tracksale (third-party)
- [x] classify with a category and type
- [ ] handle the payload and save the relevant information of them on the database (mongodb)
- [ ] provide an api to serve front-end (bff)
- [ ] improve the classification system (and again, and again, ...)

## how to run this project?

1. duplicate the `.env.sample` file located on the root path and name it as `.env`
2. change the `.env` based on your preferences
3. check if you already have installed docker
4. run `docker-compose up` command

> ⚠️ the `NODE_ENV` param in `.env` can only be set as `development` or `production`

## development and tests

to run tests, just execute this following command on the root path `yarn test`
