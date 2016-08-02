var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

module.exports = function(app){
	//pre handle user
	app.use(function(req,res,next){
		app.locals.user=req.session.user || null;
		next();
	})

	//Index
	app.get('/',Index.index)

	//User
	app.post('/user/signup',User.sendSignup);																//提交注册
	app.post('/user/signin',User.sendSignin);																//提交登录
	app.get('/signup',User.signup);																			//注册页	
	app.get('/signin',User.signin);																			//登录页
	app.get('/user/list',User.signinRequired,User.adminRequired,User.list);									//用户列表
	app.get('/user/logout',User.logout);

	//Movie
	app.get('/movie/new',User.signinRequired,User.adminRequired,Movie.new);									//新增页
	app.get('/movie/update/:id',User.signinRequired,User.adminRequired,Movie.update);						//更新页
	app.get('/movie/list',User.signinRequired,User.adminRequired,Movie.list)								//列表页
	app.post('/movie/save',User.signinRequired,User.adminRequired,Movie.savePoster,Movie.save);				//保存页
	app.delete('/movie/del',User.signinRequired,User.adminRequired,Movie.del);								//删除页
	app.get('/movie/:id',Movie.detail);																		//详情页

	//Comment
	app.post('/comment/add',User.signinRequired,Comment.add);												//新增评论

	//Category
	app.get('/category/new',User.signinRequired,User.adminRequired,Category.new);							//新增分类
	app.post('/category/add',User.signinRequired,User.adminRequired,Category.add);							//新增分类
	app.get('/category/list',User.signinRequired,User.adminRequired,Category.list);							//分类列表

	//results
	app.get('/results',Index.search);																		//搜索分类
}