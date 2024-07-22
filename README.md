## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

For the boot up you will need a running redis -for caching and queue purposes,  
A mongo DB for Logging  
A postgreSQL for general purpose data store,  
An AWS account and dedicated S3 storage for the Image, video and audio recording,  
A mailgun account for sending emails,   
An AWS account and dedicated Pinpoint service to send OTP messages for registrations.  
The dedicated Docker-file for test and prod are in root of the project for the builds and deploy.  
There is a dedicated Github action that binded to pushing of tags that automatically builds and sends the image to the docker-hub. please set up your docker user and password accordingly.  

## Installation

```bash
$ npm install
```

## Running the app

Git config deneme commit

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
