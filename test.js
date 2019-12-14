import test from 'ava';
import hapi from '@hapi/hapi';
import stripAnsi from 'strip-ansi';
import s3plugin from '.';

const makeRoute = (option) => {
    return {
        method : 'GET',
        path   : '/',
        handler() {
            return 'Hello!';
        },
        ...option
    };
};

const makeServer = async (option) => {
    const { plugin } = {
        plugin : {
            plugin  : s3plugin,
            options : {
                bucket    : 'foo',
                publicKey : 'abcdefghijklmnopqrst',
                secretKey : 'YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMQ=='
            }
        },
        ...option
    };
    const server = hapi.server();
    if (plugin) {
        await server.register(plugin);
    }
    return server;
};

test('without s3', async (t) => {
    t.plan(5);
    const server = await makeServer({ plugin : null });
    server.route(makeRoute({
        handler(request) {
            t.false('s3' in request.server);
            return { foo : 'bar' };
        }
    }));

    t.false('s3' in server);

    const response = await server.inject('/');

    t.is(response.statusCode, 200);
    t.is(response.headers['content-type'], 'application/json; charset=utf-8');
    t.is(response.payload, '{"foo":"bar"}');
});

test('s3 without bucket', async (t) => {
    const error = await t.throwsAsync(makeServer({ plugin : s3plugin }));
    t.true(error.isJoi);
    t.is(stripAnsi(error.message), '"bucket" is required');
});

test('s3 basics', async (t) => {
    t.plan(9);
    const server = await makeServer();
    server.route(makeRoute({
        handler(request) {
            const { s3 } = request.server;
            t.truthy(s3);
            t.is(typeof s3, 'object');
            t.truthy(s3.upload);
            t.is(typeof s3.upload, 'function');
            return { foo : 'bar' };
        }
    }));

    t.truthy(server.s3);
    t.is(typeof server.s3, 'object');

    const response = await server.inject('/');

    t.is(response.statusCode, 200);
    t.is(response.headers['content-type'], 'application/json; charset=utf-8');
    t.is(response.payload, '{"foo":"bar"}');
});
