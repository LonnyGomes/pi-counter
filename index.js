const Koa = require('koa');
var Router = require('koa-router');
var router = new Router();
const app = new Koa();

const Count = require('./count');
const count = new Count();

router.get('/', (ctx, next) => {
    ctx.body = count.loadCount();
});

router.post('/increment', async (ctx) => {
    ctx.body = await count.incrementCount();
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);

// now init the count display
count.init();