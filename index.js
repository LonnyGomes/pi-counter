const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');
var Router = require('koa-router');
var router = new Router();
const app = new Koa();
const cron = require('node-cron');

const Count = require('./count');
const count = new Count();

app.use(mount('/', serve('./public/')));

router.get('/status', async (ctx, next) => {
    ctx.body = await count.loadConfig();
});

router.post('/reset', async (ctx) => {
    ctx.body = await count.resetDate();
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);

cron.schedule('* * * * *', async () => {
    // update count
    await count.update();
});

(async () => {
    // now init the count display
    const { startDate, total } = await count.update();
    console.log(
        `Initialized with a start date of ${startDate} and count of ${total}`
    );
})();
