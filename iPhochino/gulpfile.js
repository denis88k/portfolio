const { src, dest, watch, parallel, series } = require('gulp');

const browserSync = require('browser-sync').create();
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const scss = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify-es').default;
const webphtml = require('gulp-webp-html-nosvg');
const svgSprite = require('gulp-svg-sprite');
const fileinclude = require('gulp-file-include');

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'app/'
		}
	});
	watch(['src/html/*.html'], html);
	watch(['src/scss/**/*.scss'], styles);
	watch(['src/js/**/*.js', '!src/js/main.min.js'], scripts);
	watch(['src/img/*.{jpg,png,gif,ico,webp}'], images);
	watch(['src/img/svg/*.svg'], svgSprites);
}

function cleanDist() {
	return del('app')
}

function html() {
	return src(['src/html/*.html', '!src/html/_*.html'])
		.pipe(fileinclude({
			prefix: '@',
			basepath: '@file'
		}))
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(webphtml())
		.pipe(dest('app'))
		.pipe(browserSync.stream())
}

function styles() {
	return src('src/scss/style.scss')
		.pipe(scss({ outputStyle: 'compressed' }).on('error', scss.logError))
		.pipe(concat('style.min.css'))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 version'],
			grid: 'autoplace',
			cascade: false
		}))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

function scripts() {
	src('src/js/libs/**.js')
		.pipe(concat('vendors.min.js'))
		.pipe(uglify())
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(dest('app/js'))
	return src('src/js/files/**.js')
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(dest('app/js'))
		.pipe(browserSync.stream())
}

function images() {
	return src('src/img/**/*.{jpg,png,gif,ico,webp}')
		.pipe(webp({
			quality: 85
		}))
		.pipe(dest('app/img'))
		.pipe(src('src/img/*.{jpg,png,gif,ico,webp}'))
		.pipe(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.mozjpeg({ quality: 80, progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 })
		]))
		.pipe(dest('app/img'))
}

function svgSprites() {
	return src('src/img/svg/*.svg')
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: '../sprite.svg'
				}
			}
		}))
		.pipe(dest('app/img'))
}

function fonts() {
	return src('src/fonts/**/*')
		.pipe(dest('app/fonts'))
}

exports.default = series(cleanDist, html, styles, scripts, svgSprites, images, fonts, browsersync);