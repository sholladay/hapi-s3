# hapi-s3 [![Build status for hapi S3](https://img.shields.io/circleci/project/sholladay/hapi-s3/master.svg "Build Status")](https://circleci.com/gh/sholladay/hapi-s3 "Builds")

> Use [Amazon S3](https://aws.amazon.com/s3/) in server routes

Provides an instance of [Scube](https://github.com/sholladay/scube) at `request.server.s3` in route handlers, so you can interact with S3 programmatically.

## Why?

 - Easily implement streaming uploads / downloads.
 - Memory efficient, one instance of the AWS SDK per server.
 - Loads credentials explicitly.

## Install

```sh
npm install hapi-s3 --save
```

## Usage

Get it into your program.

```js
const s3 = require('hapi-s3');
```

Register the plugin on your server.

```js
server.register({
    register : s3,
    options  : {
        publicKey : process.env.AWS_ACCESS_KEY_ID,
        secretKey : process.env.AWS_SECRET_ACCESS_KEY
    }
})
    .then(() => {
        return server.start();
    })
    .then(() => {
        console.log(server.info.uri);
    });
```

## API

Please see [Scube](https://github.com/sholladay/scube) for details on the `s3` object.

### option

Type: `object`

Plugin settings.

##### bucket

Type: `string`

The default bucket name to use. A bucket is a unique, worldwide namespace to store your data in. Choose it carefully.

##### publicKey

Type: `string`

The public part of your credential keypair for authenticating with AWS.

##### secretKey

Type: `string`

The private part of your credential keypair for authenticating with AWS.

## Related

 - [scube](https://github.com/sholladay/scube) - Manage your [S3](https://aws.amazon.com/s3/) buckets

## Contributing

See our [contributing guidelines](https://github.com/sholladay/hapi-s3/blob/master/CONTRIBUTING.md "Guidelines for participating in this project") for more details.

1. [Fork it](https://github.com/sholladay/hapi-s3/fork).
2. Make a feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. [Submit a pull request](https://github.com/sholladay/hapi-s3/compare "Submit code to this project for review").

## License

[MPL-2.0](https://github.com/sholladay/hapi-s3/blob/master/LICENSE "License for hapi-s3") © [Seth Holladay](https://seth-holladay.com "Author of hapi-s3")

Go make something, dang it.
