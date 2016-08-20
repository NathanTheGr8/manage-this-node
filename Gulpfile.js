var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'public'
    },
  })
})

gulp.task('sass', function(){
  	return gulp.src('public/sass/**/*.scss')
    	.pipe(sass()) // Using gulp-sass
    	.pipe(gulp.dest('public/css'))
    	.pipe(browserSync.reload({
	      stream: true
	    }))
});

//Watch task
gulp.task('watch', ['browserSync', 'sass'], function (){
  	gulp.watch('public/scss/**/*.scss', ['sass']); 
  	// Other watchers
})

gulp.task('default', ['sass'], function() {
    gulp.watch('public/sass/**/*.scss',['sass']);
});

function swallowError (error) {

  // If you want details of the error in the console
  console.log(error.toString())

  this.emit('end')
}