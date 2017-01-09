'use strict';
module.exports = function(grunt) {
	grunt.initConfig({
		sass: {
		  dev: {
		    options: {
		      style: 'expanded',
		      compass: true
		    },
		    files: {
		      '<%= project.assets %>/css/style.css': '<%= project.css %>'
		    }
		  }
		},
		project: {
			app: 'app',
			assets: '<%= project.app %>/assets',
			src: '<%= project.assets %>/src',
			css: [
				'<%= project.src %>/scss/main.scss'
			]
		},
		watch: {
		  sass: {
		    files: '<%= project.src %>/scss/{,*/}*.{scss,sass}',
		    tasks: ['sass:dev']
		  }
		},
		pkg: grunt.file.readJSON('package.json')
	});
	module.exports = function(grunt) {

	};
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	grunt.registerTask('default', [
	  'sass:dev',
	  'watch'
	]);
};