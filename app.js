const Koa = require("koa");

const render = require("koa-art-template");
const path = require("path");
const static = require("koa-static");
const bodyparser = require("koa-bodyparser");
const session = require("koa-session");
const router = require("./routes/index");
const { store } = require("./tools/session");
const {io, getApp} = require("./tools/io");

let app = new Koa();
getApp(app)
io.attach(app);

app.keys = ["hello"];
global.mySessionStore = {};

render(app, {
    root: path.join(__dirname, "view"),
    extname: ".html",
    debug: process.env.NODE_ENV !== "production"
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