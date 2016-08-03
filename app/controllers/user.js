var User = require('../models/user');

//signin
exports.signin = function(req,res){
	res.render('signin',{
		title:'登录页'
	})
}

//signup
exports.signup = function(req,res){
	res.render('signup',{
		title:'注册页'
	})
}

//sendSignup
exports.sendSignup = function(req,res){
	var _user = req.body.user;
	User.findOne({name:_user.name},function(err,user){
		if(err) console.log(err);
		if(user){
			res.redirect('/signin');			//如果注册用户已存在跳转登陆页
		}else{
			var userObj = new User(_user);
			userObj.save(function(err,user){
				if(err) console.log(err);
				res.redirect('/user/list');
			})
		}
	})
}

//sendSignin 
exports.sendSignin = function(req,res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	User.findOne({name:name},function(err,user){
		if(err) console.log(err);
		if(!user) return res.redirect('/signup'); //如果登陆不存在此用户跳转注册
		user.comparePassword(password,function(err,isMatch){
			if(err) console.log(err);
			if(isMatch){
				req.session.user = user;
				res.redirect('/');
			}else{
				res.redirect('/signin');
				console.log('password is not matched');
			}
		})
	})
}

//logout
exports.logout = function(req,res){
	delete req.session.user;
	res.redirect('/');
}

//userlist page
exports.list = function(req,res){
	User.fetch(function(err,users){
		if(err) console.log(err);
		res.render('userlist',{
			title:'imooc 用户列表',
			users:users
		})
	})
}

//signinRequired
exports.signinRequired = function(req,res,next){
	var user = req.session.user;
	if(!user){
		res.redirect('/signin');
	}
	next();
}

//adminRequired
exports.adminRequired = function(req,res,next){
	var user = req.session.user;
	if(user.role <= 10){
		res.redirect('/');
	}
	next();
}