const Koa = require("koa");
const Router = require("koa-router");

const render = require("koa-art-template");
const path = require("path");
const static = require("koa-static");
const bodyparser = require("koa-bodyparser");
const session = require("koa-session");

let app = new Koa();
let router = new Router();

app.keys = ["hello"];

const CONFIG = {
    key: "koa:sess" /** (string) cookie key (default is koa:sess) */,
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true /** (boolean) automatically commit headers (default true) */,
    overwrite: true /** (boolean) can overwrite or not (default true) */,
    httpOnly: true /** (boolean) httpOnly or not (default true) */,
    signed: true /** (boolean) signed or not (default true) */,
    rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
    renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

const store = {
    storage: {},
    get(key) {
        return this.storage[key];
    },
    set(key, session) {
        this.storage[key] = session;
    },
    destroy(key) {
        delete this.storage[key];
    }
};

render(app, {
    root: path.join(__dirname, "view"),
    extname: ".html",
    debug: process.env.NODE_ENV !== "production"
});

router.get("/", async ctx => {
    ctx.render("index");
});

router.post("/login", async ctx => {
    let { username, password } = ctx.request.body;
    ctx.session.user = {
        username
    };
    ctx.redirect("/list");
});

router
    .get("/list", ctx => {
        let arr = [1, 2, 3, 4];
        console.log(ctx.session.user);
        if (!ctx.session.user) {
            ctx.redirect("/");
        }
        let { username } = ctx.session.user;
        ctx.render("list", { arr, username });
    })
    .get("/test", async ctx => {
        ctx.body = {
            msg: "TxTData"
        };
    });

app.use(async (ctx, next) => {
    if (ctx.url.includes("public")) {
        ctx.url = ctx.url.replace("/public", "");
    }
    await next();
});
app.use(session({ store }, app));
app.use(bodyparser());
app.use(static(path.resolve("./public")));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8888, () => {
    console.log("服务起在 8888 端口");
});
