const $fs = require('fs');
const $path = require('path');
const $gulp = require('gulp');
const $gulpMocha = require('gulp-mocha');

const $upload = require('./index');
const $config = require('./test/config');

$gulp.task('prepare', done => {
	const timestamp = Date.now();
	console.log('Local timestamp:', timestamp);
	const content = `console.log(${timestamp});\n`;
	$fs.writeFileSync($path.resolve(__dirname, './temp/test.js'), content, 'utf8');
	$fs.writeFileSync($path.resolve(__dirname, './temp/test1.js'), content, 'utf8');
	$fs.writeFileSync($path.resolve(__dirname, './temp/test2.js'), content, 'utf8');
	$fs.mkdirSync($path.resolve(__dirname, './temp/dir/sub'), { recursive: true });
	$fs.writeFileSync($path.resolve(__dirname, './temp/dir/sub/testdir.js'), content, 'utf8');
	done();
});

const uploadConfig = {
	cdn: true,
	debug: false,
	overwrite: true,
	AppId: $config.AppId,
	SecretId: $config.SecretId,
	SecretKey: $config.SecretKey,
	Bucket: $config.Bucket,
	Region: $config.Region,
	prefix: $config.prefix
};

$gulp.task(
	'upload',
	() => $gulp.src(['**/*'], {
		cwd: 'temp'
	}).pipe($upload(uploadConfig))
);

$gulp.task(
	'upload-withBase',
	() => $gulp.src(['**/*'], {
		cwd: 'temp',
		base: './base'
	}).pipe($upload(uploadConfig))
);

$gulp.task(
	'mocha',
	() => $gulp.src('test/test.js')
		.pipe($gulpMocha())
);

$gulp.task('test', $gulp.series(
	'prepare',
	'upload',
	'upload-withBase',
	'mocha'
));

$gulp.task('default', $gulp.series(
	'test'
));
