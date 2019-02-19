const $fs = require('fs');
const $path = require('path');
const $gulp = require('gulp');
const $gulpMocha = require('gulp-mocha');
const $runSequence = require('run-sequence');

const $upload = require('./index');
const $config = require('./test/config');

$gulp.task('prepare', done => {
	$config.timestamp = Date.now();
	const content = `console.log(${$config.timestamp});\n`;
	$fs.writeFileSync($path.resolve(__dirname, './temp/test.js'), content, 'utf8');
	$fs.writeFileSync($path.resolve(__dirname, './temp/test1.js'), content, 'utf8');
	$fs.writeFileSync($path.resolve(__dirname, './temp/test2.js'), content, 'utf8');
	done();
});

$gulp.task(
	'upload',
	() => $gulp.src(['**/*'], {
		cwd: 'temp'
	}).pipe($upload({
		cdn: true,
		debug: true,
		overwrite: true,
		AppId: $config.AppId,
		SecretId: $config.SecretId,
		SecretKey: $config.SecretKey,
		Bucket: $config.Bucket,
		Region: $config.Region,
		prefix: $config.prefix
	}))
);

$gulp.task(
	'mocha',
	() => $gulp.src('test/test.js')
		.pipe($gulpMocha())
);

$gulp.task('test', () => $runSequence(
	'prepare',
	'upload',
	'mocha'
));

$gulp.task('default', [
	'test'
]);

