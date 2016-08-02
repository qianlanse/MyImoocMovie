var Movie = require('../models/movie');
var Category = require('../models/category');
const COUNT = 6;

//index
exports.index = function(req,res){
	Category
		.find({})
		.populate({path:'movies',options:{limit:COUNT}})
		.exec(function(err,categories){
			if(err) console.log(err);
			res.render('index',{
				title:'imooc 首页',
				categories:categories
			})
		})
}

//search
exports.search = function(req,res){
	var catId = req.query.cat;
	var q = req.query.q;
	var page = parseInt(req.query.p) || 0;
	var index = page * COUNT

	if(catId){
		Category
			.find({_id:catId})
			.populate({
				path:'movies',
				select:'title poster'
			})
			.exec(function(err,categories){
				if(err) console.log(err);
				var category = categories[0] || {};
				var movies = category.movies || [];
				var results = movies.slice(index,index + COUNT)
				res.render('results',{
					title:'imooc 搜索结果',
					keyword:category.name,
					query:'cat=' + catId,
					currentPage:(page + 1),
					totalPage:Math.ceil(movies.length / COUNT),
					movies:results
				})
			})
	}else{
		var exp = new RegExp(q+'.*','i');
		Movie.find({title:exp}).exec(function(err,movies){
			if(err) console.log(err);
			for(var i in movies){
				movies[i].title = movies[i].title.replace(q,'<span style="color:red;">' + q + '</span>');
			}
			var results = movies.slice(index,index + COUNT)
			res.render('results',{
				title:'imooc 搜索结果',
				keyword:q,
				query:'q=' + q,
				currentPage:(page + 1),
				totalPage:Math.ceil(movies.length / COUNT),
				movies:movies
			})
		})
	}
}