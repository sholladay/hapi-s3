# hapi-s3 [![Build status for hapi S3](https://travis-ci.com/sholladay/hapi-s3.svg?branch=master "Build Status")](https://travis-ci.com/sholladay/hapi-s3 "Builds")

> Use [Amazon S3](https://aws.amazon.com/s3/) in your [hapi](https://hapijs.com/) server

Provides an instance of [Scube](https://github.com/sholladay/scube), a thin wrapper around the S3 client from the [AWS SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html), so you can interact with S3 programmatically. It is available at `request.server.s3` in route handlers.

## Why?

 - Easily implement streaming uploads / downloads.
 - Memory efficient, with one instance of the [AWS SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html) per server.
 - Loads credentials explicitly.

## Install

```sh
npm install hapi-s3 --save
```

## Usage

Register the plugin on your server to make `request.server.s3` available in route handlers.

```js
const hapi = require('hapi');
const s3 = require('hapi-s3');

const server = hapi.server();

const init = async () => {
    await server.register({
        plugin  : s3,
        options : {
            publicKey : process.env.AWS_ACCESS_KEY_ID,
            secretKey : process.env.AWS_SECRET_ACCESS_KEY
        }
    });
    server.route({
        method : 'GET',
        path   : '/',
        async handler(request) {
            const { s3 } = request.server;
            const buckets = await s3.listBuckets();
            return buckets;
        }
    });
    await server.start();
    console.log('Server ready:', server.info.uri);
};

init();
```

## API

Please see [Scube](https://github.com/sholladay/scube) for details on the `s3` object.

### Plugin options

Type: `object`

The options are passed to `new Scube()` to configure the S3 client. See [Scube](https://github.com/sholladay/scube) for details on the available options, such as `bucket`, `region`, and others.

### Decorations

For convenience, this plugin adds the following API to the hapi server instance.

#### server.s3

An instance of [Scube](https://github.com/sholladay/scube), a thin wrapper around the S3 client from the [AWS SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html). This is available as `request.server.s3` inside of route handlers.

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
