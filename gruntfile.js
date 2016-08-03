module.exports = function(grunt){
	grunt.initConfig({
		watch:{							//时时监听文件的增删改查
			jade:{
				files:['views/**'],
				options:{
					livereload:true
				}
			},
			js:{
				files:['public/js/**','models/**/*.js','schemas/**/*.js'],
				//tasks:['jshint']  //编码格式的检查
				options:{
					livereload:true
				}
			},
			uglify: {
				files: ['public/**/*.js'],
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			styles: {
				files: ['public/**/*.less'],
				tasks: ['less'],
				options: {
					nospawn: true
				}
			}
		},
		nodemon:{						//监听入口文件的修改
			dev:{
				options:{
					file: 'app.js',
					args:[],
					ignoredFiles:['README.md','node_modules/**','.DS_Store'],
					watchedExtensions: ['js'],
					watchedFolders: ['./'],
					debug:true,
					delayTime:1,
					env:{
						PORT:3000
					},
					cwd:__dirname
				}
			}
		},
		less: {
			development: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2
				},
				files: {
					'public/build/index.css': 'public/less/index.less'
				}
			}
		},
		jshint:{
			options:{
				jshintrc:'.jshintrc',
				ignores:['public/libs/**/*.js']
			},
			all:['public/js/*.js','test/**/*.js','app/**/*.js']
		},
	    uglify: {
	      	development: {
	        	files: {
	        		//'public/build/movie.min.js': 'public/js/movie.js',
	        		'public/build/all.min.js': ['public/js/detail.js','public/js/movie.js']
	        	}
	      	}
	    },
		mochaTest:{
			options:{
				reporter:'spec'
			},
			src:['test/**/*.js']
		},
		concurrent:{
			tasks:['nodemon','watch','less', 'uglify', 'jshint'],
			options:{
				logConcurrentOutput:true
			}
		}
	})
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-mocha-test');					//单月测试
	grunt.loadNpmTasks('grunt-contrib-less');				//less 文件编译
	grunt.loadNpmTasks('grunt-contrib-uglify');				//js 文件压缩
	grunt.loadNpmTasks('grunt-contrib-jshint');				//代码规范检测

	grunt.option('force',true);
	grunt.registerTask('default',['concurrent']);
	grunt.registerTask('test',['mochaTest']);
}