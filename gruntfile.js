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
			}
		},
		nodemon:{						//监听入口文件的修改
			dev:{
				script:'app.js',
				options:{
					args:[],
					ignoredFiles:['README.md','node_modules/**','.DS_Store'],
					ext:'js',
					watch:['./'],
					debug:true,
					delayTime:1,
					env:{
						PORT:3000
					},
					cwd:__dirname
				}
			}
		},
		concurrent:{
			tasks:['nodemon','watch'],
			options:{
				logConcurrentOutput:true
			}
		}
	})
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.option('force',true);
	grunt.registerTask('default',['concurrent']);
}