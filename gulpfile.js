var gulp = require('gulp');
//require gulp-sass plugin
var sass = require('gulp-sass');
//require Browser Sync stuff
var browserSync = require('browser-sync').create();
//Optimize images
var imagemin = require('gulp-imagemin');
//optimize images in the cache
var cache = require('gulp-cache');
//Optimizing CSS and JS
//This will concatenate required javascript files
var useref = require('gulp-useref');
//Uglify
//This will minimize the concatenated js file
var uglify = require('gulp-uglify');
//minimizes css files
var cssnano = require('gulp-cssnano');
var gulpIf = require('gulp-if');
//cleans up the generated files folder (/dist)
var del = require('del');
var runSequence = require('run-sequence');

/* This is an example of how to combine gulp tasks together using runSequence()
gulp.task('task-name', function(callback) {
	runSequence('task-one', 'task-two', 'task-three', callback);
	//run tasks in an array
	//runSequence('task-one', ['task-two','task-three'], 'task-four', callback);
});
*/

gulp.task('clean:dist', function() {
	return del.sync('dist');
});

gulp.task('cache:clear', function(callback) {
	return cache.clearAll(callback)
});

gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: 'app'
		},
	})
});


gulp.task('hello', function() {
	console.log('Hey man');
});

gulp.task('sass', function() {
	return gulp.src('app/scss/**/*.scss')
	.pipe(sass()) //USE gulp-sass
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
});

gulp.task('images', function(){
	return gulp.src('app/images/*')
	//.pipe(cache(imagemin()))
	.pipe(imagemin())
	.pipe(gulp.dest('dist/images'))
});

gulp.task('useref', function() {
	return gulp.src('app/*.html')
	.pipe(useref())
	//minify only if it's a js file
	.pipe(gulpIf('*.js', uglify()))
	//minify only if it's a css file
	.pipe(gulpIf('*.css', cssnano()))
	.pipe(gulp.dest('dist'))
});

gulp.task('fonts', function() {
	return gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'))
});

gulp.task('dimages', function() {
	return gulp.src('app/images/**/*')
	.pipe(gulp.dest('dist/images'))
});

//Gulp watch syntax
gulp.task('watch', ['browserSync', 'sass'], function(){
gulp.watch('app/scss/**/*.scss', ['sass']);
// Reloads the browser when HTML or JS files are changed
gulp.watch('app/*.html', browserSync.reload);
gulp.watch('app/js/**/*.js', browserSync.reload);
//other watchers go here
});

gulp.task('default', function(callback) {
	runSequence(['sass','browserSync','watch'], callback)
});

gulp.task('build', function(callback) {
	runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'], callback)
});

