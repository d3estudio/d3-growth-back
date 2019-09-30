# d3-growth-back

the target is to build an awesome tool that can help the growth process.

## tech

this api is being built with these technologies:

- node 12.10.0
- docker

## roadmap

- [ ] retrieve all customers answers from tracksale (third-party)
- [ ] handle the payload and save the relevant information of them on the database (mongodb)
- [ ] classify with a theme, category, and epic
- [ ] provide an api to serve front-end (bff)
- [ ] improve the classification system (and repeat, and repeat, ...)

## how to run this project?

1. duplicate the `.env.sample` file located on the root path and name it as `.env`
2. check if you already have installed docker
3. run `docker-compose up` command

## development and tests

to run tests, just execute this following command on the root path `yarn test`
