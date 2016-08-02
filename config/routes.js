var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');

module.exports = function(app){
	//pre handle user
	app.use(function(req,res,next){
		app.locals.user=req.session.user || null;
		next();
	})

	//Index
	app.get('/',Index.index)

	//User
	app.post('/user/signup',User.sendSignup);												//注册页
	app.post('/user/signin',User.sendSignin);												//登录页
	app.get('/signup',User.signup);					
	app.get('/signin',User.signin);					
	app.get('/user/list',User.signinRequired,User.adminRequired,User.list);					//用户列表
	app.get('/user/logout',User.logout);

	//Movie
	app.get('/movie/new',User.signinRequired,User.adminRequired,Movie.new);					//新增页
	app.get('/movie/update/:id',User.signinRequired,User.adminRequired,Movie.update);		//更新页
	app.get('/movie/list',User.signinRequired,User.adminRequired,Movie.list)				//列表页
	app.post('/movie/save',User.signinRequired,User.adminRequired,Movie.save);				//保存页
	app.delete('/movie/del',User.signinRequired,User.adminRequired,Movie.del);				//删除页
	app.get('/movie/:id',Movie.detail);														//详情页
}