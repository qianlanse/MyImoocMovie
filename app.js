var express = require('express');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var cookieParser = require('cookie-parser')
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongodb');
var port = process.env.PORT || 3000;
var app = express();
var fs = require('fs');
var dbUrl = 'mongodb://localhost/imooc';
mongoose.connect(dbUrl);

// models loading
var models_path = __dirname + '/app/models';
var walk = function(path){
	fs.readdirSync(path).forEach(function(file){
		var newPath = path + '/' + file;
		var stat = fs.statSync(newPath);
		if(stat.isFile()){
			if(/(.*)\.(js|coffee)/.test(file)){
				require(newPath);
			}
		}else if(stat.isDirectory){
			walk(newPath);
		}
	})
}
walk(models_path);

app.set('views','./app/views/pages');
app.set('view engine','jade');
app.use(bodyParser.urlencoded({extended: true}));//格式化POST数据
app.use(serveStatic('public'));//静态文件
app.use(require('connect-multiparty')());		//上传文件
app.locals.moment = require('moment');
app.use(cookieParser());
app.use(session({
	secret:'imooc',
	store:new mongoStore({
		url:dbUrl,
		collection:'sessions'
	})
}))
app.listen(port);
require('./config/routes')(app);

//开发环境配置
if(app.get('env') === 'development'){
	app.set('showStackError',true);
	app.use(morgan(':method :url :status'));
	app.locals.pretty = true;//设置源码可读
	mongoose.set('debug',true);
}

console.log('imooc started on port '+port);