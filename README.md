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
- [x] handle the payload and save the relevant information of them on the database (mongodb)
- [x] provide an api to serve front-end (bff)
- [ ] improve the classification system (and again, and again, ...)

## how to run this project in development mode?

1. duplicate the `.env.sample` file located on the root path and name it as `.env`
2. change the `.env` based on your preferences
3. check if you already have installed docker and docker-compose
4. run `docker-compose up dev` command

## how to run the tests?

to run tests, just execute this following command on the root path `docker-compose up test`

## how to build?

to build an image, follow the next steps:

1. config the `.env` file like the development mode
2. run the following command to build the image:

```sh
$ docker build -f Dockerfile.prod -t d3_growth_backend:1.0.2 .
```

3. then, you can start the container:

```sh
$ docker run -it -p 3000:3000 --name d3_growth_backend d3_growth_backend:1.0.2
```
