import test from 'ava';
import hapi from 'hapi';
import stripAnsi from 'strip-ansi';
import s3plugin from '.';

const mockRoute = (option) => {
    return {
        method : 'POST',
        path   : '/',
        handler() {
            return { foo : 'bar' };
        },
        ...option
    };
};

const mockServer = async (option) => {
    const { plugin, route } = {
        plugin : {
            plugin  : s3plugin,
            options : {
                bucket    : 'foo',
                publicKey : 'abcdefghijklmnopqrst',
                secretKey : 'YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMQ=='
            }
        },
        route : mockRoute(),
        ...option
    };
    const server = hapi.server();
    if (plugin) {
        await server.register(plugin);
    }
    if (route) {
        server.route(route);
    }
    return server;
};

const mockRequest = (server, option) => {
    return server.inject({
        method : 'POST',
        url    : '/',
        ...option
    });
};

test('without s3', async (t) => {
    const server = await mockServer({
        plugin : null,
        route  : mockRoute({
            handler(request) {
                t.false('s3' in request.server);
                return { foo : 'bar' };
            }
        })
    });

    t.false('s3' in server);

    const response = await mockRequest(server);

    t.is(response.statusCode, 200);
    t.is(response.headers['content-type'], 'application/json; charset=utf-8');
    t.is(response.payload, '{"foo":"bar"}');
});

test('s3 without bucket', async (t) => {
    const err = await t.throws(mockServer({
        plugin : s3plugin
    }));
    t.true(err.isJoi);
    // F t.is(err.message, 'child "bucket" fails because ["bucket" is required]');
    t.is(stripAnsi(err.message), '{\n  "bucket" [1]: -- missing --\n}\n\n[1] "bucket" is required');
});

test('s3 basics', async (t) => {
    const server = await mockServer({
        route : mockRoute({
            handler(request) {
                const { s3 } = request.server;
                t.truthy(s3);
                t.is(typeof s3, 'object');
                t.truthy(s3.upload);
                t.is(typeof s3.upload, 'function');
                return { foo : 'bar' };
            }
        })
    });

    t.truthy(server.s3);
    t.is(typeof server.s3, 'object');

    const response = await mockRequest(server);

    t.is(response.statusCode, 200);
    t.is(response.headers['content-type'], 'application/json; charset=utf-8');
    t.is(response.payload, '{"foo":"bar"}');
});
