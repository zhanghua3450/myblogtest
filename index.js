var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite')(__dirname);
var routers = require('./routes');
var pkg = require('./package');

var app = express();

//设置模版目录
app.set('views', path.resolve(__dirname, 'views'));
//设置模版引擎为‘ejs’
app.set('view engine', 'ejs');

//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

//seesion middlewares
app.use(session({
    name: config.session.key, //设置cookie中保存的session ID 的字段名称
    secret: config.session.secret, //通过设置secret来计算hash值

    cookie: {
        maxAge: config.session.maxAge // 过期时间，过期后 cookie 中的 session id 自动删除
    },
    store: new MongoStore({ // 将 session 存储到 mongodb
        url: config.mongodb // mongodb 地址
    })
}));

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
    uploadDir: path.join(__dirname, 'public/img'),
    keepExtensions: true
}))

//flash 中间价，用来显示通知
app.use(flash());

// 设置模板全局常量
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
};

// 添加模板必需的三个变量
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

//路由
routers(app);

app.listen(config.port, function() {
    console.log(`${pkg.name} listening on port ${config.port}`);
});