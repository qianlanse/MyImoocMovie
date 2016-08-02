var Category = require('../models/category');

//add category
exports.add = function(req,res){
	var _category = req.body.category;
	var category = new Category(_category);

	category.save(function(err,category){
		if(err) console.log(err);
		res.redirect('/category/list')
	})
}

//list category
exports.list = function(req,res){
	Category.fetch(function(err,categories){
		if(err) console.log(err);
		res.render('categorylist',{
			title:'电影分类列表页',
			categories:categories
		})
	})
}

//new category
exports.new = function(req,res){
	res.render('category',{
		title:'新增电影分类',
		category:{}
	})
}