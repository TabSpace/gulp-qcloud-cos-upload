const $fs = require('fs');
const $path = require('path');
const $gulp = require('gulp');
const $gulpMocha = require('gulp-mocha');
const $gulpEslint = require('gulp-eslint');
const $runSequence = require('run-sequence');

const $upload = require('./index');
const $config = require('./temp/config');
const $eslintrc = require('./.eslintrc');

$gulp.task('lint', () => {
	if ($eslintrc.globals && !Array.isArray($eslintrc.globals)) {
		$eslintrc.globals = Object.keys($eslintrc.globals);
	}

	return $gulp.src([
		'index.js',
		'test/**/*.js'
	])
		.pipe($gulpEslint($eslintrc))
		.pipe($gulpEslint.formatEach('compact', process.stderr))
		.pipe($gulpEslint.failAfterError());
});

$gulp.task('prepare', done => {
	$config.timestamp = Date.now();
	const content = `console.log(${$config.timestamp});\n`;
	$fs.writeFileSync($path.resolve(__dirname, './temp/files/noop1.js'), content, 'utf8');
	$fs.writeFileSync($path.resolve(__dirname, './temp/files/noop2.js'), content, 'utf8');
	done();
});

$gulp.task(
	'upload',
	() => $gulp.src(['**/*'], {
		cwd: './temp/files/'
	}).pipe($upload({
		overwrite: true,
		AppId: $config.AppId,
		SecretId: $config.SecretId,
		SecretKey: $config.SecretKey,
		Bucket: $config.Bucket,
		Region: $config.Region,
		prefix: 'temp/gulp'
	}))
);

$gulp.task(
	'mocha',
	() => $gulp.src('test/test.js')
		.pipe($gulpMocha())
);

$gulp.task('test', () => $runSequence(
	'lint',
	'prepare',
	'upload',
	'mocha'
));

$gulp.task('default', [
	'test'
]);

