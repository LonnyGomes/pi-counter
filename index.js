const Koa = require('koa');
var Router = require('koa-router');
var router = new Router();
const app = new Koa();

const Count = require('./count');
const count = new Count();

router.get('/', async (ctx, next) => {
    ctx.body = await count.loadConfig();
});

router.post('/reset', async (ctx) => {
    ctx.body = await count.resetDate();
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);

(async () => {
    // now init the count display
    const { startDate, total } = await count.update();
    console.log(
        `Initialized with a start date of ${startDate} and count of ${total}`
    );
})();
