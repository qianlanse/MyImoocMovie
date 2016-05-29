var Movie = require('../models/movie');
var _ = require('underscore');

//detail page
exports.detail = function(req,res){
	var id = req.params.id;
	Movie.findById(id,function(err,movie){
		console.log(movie);
		if(err) console.log(err);
		res.render('detail',{
			title:'imooc '+movie.title,
			movie:movie
		})
	})
}

//new page
exports.new = function(req,res){
	res.render('movie',{
		title:'imooc 电影录入页',
	    movie:{
	      title:'',
	      director:'',
	      country:'',
	      language:'',
	      poster:'',
	      flash:'',
	      year:'',
	      summary:''
	    }
	})
}

//update page
exports.update = function(req,res){
	var id = req.params.id;
	if(id){
		Movie.findById(id,function(err,movie){
			if(err) console.log(err);
			res.render('movie',{
				title:'imooc 电影更新页',
				movie:movie
			})
		})
	}
}

//save page
exports.save = function(req,res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	if(id !== 'undefined'){
		Movie.findById(id,function(err,movie){
			if(err) console.log(err);
			_movie = _.extend(movie,movieObj);
			_movie.save(function(err,movie){
				if(err) console.log(err);
				res.redirect('/movie/'+movie._id)
			})
		})
	}else{
		_movie = new Movie({
			director:movieObj.director,
			title:movieObj.title,
			language:movieObj.language,
			country:movieObj.country,
			summary:movieObj.summary,
			flash:movieObj.flash,
			poster:movieObj.poster,
			year:movieObj.year
		});
		_movie.save(function(err,movie){
			if(err) console.log(err);
			res.redirect('/movie/'+movie._id)
		})
	}
}

//list page
exports.list =function(req,res){
	Movie.fetch(function(err,movies){
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
