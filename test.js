import test from 'ava';
import { Server } from 'hapi';
import s3plugin from '.';

const mockRoute = (option) => {
    return Object.assign(
        {
            method : 'POST',
            path   : '/',
            handler(request, reply) {
                reply({ foo : 'bar' });
            }
        },
        option
    );
};

const mockServer = async (option) => {
    const { plugin, route } = Object.assign(
        {
            plugin : {
                register : s3plugin,
                options  : {
                    bucket    : 'foo',
                    publicKey : 'abcdefghijklmnopqrst',
                    secretKey : 'YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMQ=='
                }
            },
            route  : mockRoute()
        },
        option
    );
    const server = new Server();
    server.connection();
    if (plugin) {
        await server.register(plugin);
    }
    if (route) {
        server.route(route);
    }
    return server;
};

const mockRequest = (server, option) => {
    return server.inject(Object.assign(
        {
            method : 'POST',
            url    : '/'
        },
        option
    ));
};

test('without s3', async (t) => {
    const server = await mockServer({
        plugin : null,
        route  : mockRoute({
            handler(request, reply) {
                t.false('s3' in request.server);
                reply({ foo : 'bar' });
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
    t.is(err.message, 'child "bucket" fails because ["bucket" is required]');
});

test('s3 basics', async (t) => {
    const server = await mockServer({
        route : mockRoute({
            handler(request, reply) {
                const { s3 } = request.server;
                t.truthy(s3);
                t.is(typeof s3, 'object');
                t.truthy(s3.upload);
                t.is(typeof s3.upload, 'function');
                reply({ foo : 'bar' });
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
