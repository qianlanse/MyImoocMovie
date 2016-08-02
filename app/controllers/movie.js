var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

//detail page
exports.detail = function(req,res){
	var id = req.params.id;
	Movie.update({_id:id},{$inc:{pv:1}},function(err){
		if(err) console.log(err);
	})
	Movie.findById(id,function(err,movie){
		Comment
		.find({movie:id})
		.populate('from','name')
		.populate('reply.from reply.to','name')
		.exec(function(err,comments){
			if(err) console.log(err);
			res.render('detail',{
				title:'imooc '+movie.title,
				movie:movie,
				comments:comments
			})
		})
	})
}

//new page
exports.new = function(req,res){
	Category.find({},function(err,categories){
		if(err) console.log(err);
		res.render('movie',{
			title:'imooc 电影录入页',
			categories:categories,
		    movie:{}
		})
	})
}

//update page
exports.update = function(req,res){
	var id = req.params.id;
	if(id){
		Movie.findById(id,function(err,movie){
			Category.find({},function(err,categories){
				if(err) console.log(err);
				res.render('movie',{
					title:'imooc 电影更新页',
					movie:movie,
					categories:categories
				})
			})
		})
	}
}

//poster save
exports.savePoster = function(req,res,next){
	var posterData = req.files.uploadPoster;
	var filePath = posterData.path;
	var originalFilename = posterData.originalFilename;

	if(originalFilename){
		fs.readFile(filePath,function(err,data){
			var timestamp = Date.now();
			var type = posterData.type.split('/')[1];
			var poster = timestamp + '.' + type;
			var newPath = path.join(__dirname,'../../','/public/upload/' + poster);
			fs.writeFile(newPath,data,function(err){
				req.poster = poster;
				next();
			})
		})
	}else{
		next();
	}
}

//save page
exports.save = function(req,res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;

	if(req.poster){
		movieObj.poster = req.poster;
	}

	if(id){												//修改
		Movie.findById(id,function(err,movie){
			if(err) console.log(err);
			_movie = _.extend(movie,movieObj);
			Category.findById(movie.category,function(err,category){
				console.log(category);
			})
			_movie.save(function(err,movie){
				if(err) console.log(err);
				res.redirect('/movie/'+movie._id)
			})
		})
	}else{												//新增
		_movie = new Movie(movieObj);
		var categoryId = movieObj.category;
		var categoryName = movieObj.categoryName;

		_movie.save(function(err,movie){
			if(err) console.log(err);
			if(categoryId){
				Category.findById(categoryId,function(err,category){
					category.movies.push(movie._id);
					category.save(function(err,category){
						res.redirect('/movie/'+movie._id)
					})
				})
			}else if(categoryName){
				var category = new Category({
					name:categoryName,
					movies:[movie._id]
				})
				category.save(function(err,category){
					movie.category = category._id;
					movie.save(function(err,movie){
						res.redirect('/movie/'+movie._id)
					})
				})
			}
		})
	}
}

//list page
exports.list = function(req,res){
	Movie.find({}).populate('Category','name').exec(function(err,movies){
		console.log(movies);
		if(err) console.log(err);
		res.render('list',{
			title:'imooc 列表',
			movies:movies
		})
	})
}

//delete page
exports.del = function(req,res){
	var id = req.query.id;
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err);
			}else{
				res.json({success:1});
			}
		})
	}
}
