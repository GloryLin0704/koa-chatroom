const Router = require("koa-router");

let router = new Router();
let { mySessionStore } = require("../tools/session");

router.get("/", async ctx => {
    ctx.render("index");
});

router.post("/login", async ctx => {
    let { username } = ctx.request.body;

    ctx.session.user = {
        username
    };
    ctx.redirect("/list");
});

router.get("/list", ctx => {
    if (ctx.session.user == undefined) {
        ctx.redirect("/");
        return;
    }
    let { username } = ctx.session.user;
    ctx.render("list", { username });
});

module.exports = router;
