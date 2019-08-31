import * as Koa from 'koa';
var bodyParser = require('koa-bodyparser');

export default function () {
    var call = bodyParser({
        formLimit: '10mb',
        textLimit : '20mb',
        jsonLimit : '20mb'
    })
    return async function (ctx: Koa.Context, next: any) {
        var result = call(ctx, next)
        await result;
    }
}