/*eslint-env node */

var gulp = require('gulp');
//var sass = require('gulp-sass');
//var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
//var concat = require('gulp-concat');
//var uglify = require('gulp-uglify');
//var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
//var sourcemaps = require('gulp-sourcemaps');
//var htmlmin = require('gulp-htmlmin');

gulp.task('default', function() {
    gulp.watch('./js/**/*.js').on('change', browserSync.reload);
    gulp.watch('./index.html').on('change', browserSync.reload);

    browserSync.init({
        server: './'
    });
});

// gulp.task('default', ['copy-html', 'copy-images', 'styles', 'lint', 'scripts'], function() {
// 	//gulp.watch('./sass/**/*.scss', ['styles']);
// 	gulp.watch('./js/**/*.js', ['lint', 'scripts']).on('change', browserSync.reload);
// 	gulp.watch('./index.html', ['copy-html']);
// 	gulp.watch('./dist/index.html').on('change', browserSync.reload);

// 	browserSync.init({
// 		server: './dist'
// 	});
// });

// gulp.task('dist', [
// 	'copy-html',
// 	'copy-images',
// 	'styles',
// 	'lint',
// 	'scripts-dist'
// ],
	
// 	function(){
// 		browserSync.init({
// 			server: './dist'
// 		});
// 	}
// );

// gulp.task('copy-html', function() {
// 	gulp.src('./index.html')
// 		.pipe(htmlmin({collapseWhitespace: true}))
// 		.pipe(gulp.dest('./dist'));
// });

// gulp.task('copy-images', function() {
// 	gulp.src('./img/*.*')
// 		.pipe(gulp.dest('./dist/img'));
// });

// gulp.task('styles', function() {
// 	gulp.src('sass/**/*.scss')
// 		.pipe(sourcemaps.init())
// 		.pipe(sass({
// 			outputStyle: 'compressed'
// 		}).on('error', sass.logError))
// 		.pipe(autoprefixer({
// 			browsers: ['last 2 versions']
// 		}))
// 		.pipe(sourcemaps.write())
// 		.pipe(gulp.dest('./dist/css'))
// 		.pipe(browserSync.stream());
// });

gulp.task('lint', function () {
    return gulp.src(['./js/**/*.js'])
        .pipe(plumber())
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failOnError last.
        .pipe(eslint.failOnError());
});

// gulp.task('scripts', function() {
// 	gulp.src('./js/**/*.js')
// 		.pipe(concat('all.js'))
// 		.pipe(gulp.dest('./dist/js'));
// });

// gulp.task('scripts-dist', function() {
// 	gulp.src('./js/**/*.js')
// 		.pipe(concat('all.js'))
// 		.pipe(uglify())
// 		.pipe(gulp.dest('./dist/js'));
// });
