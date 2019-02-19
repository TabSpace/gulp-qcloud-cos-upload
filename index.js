const $fs = require('fs');
const $path = require('path');
const $gutil = require('gulp-util');
const $through = require('through2');
const $qcloudUpload = require('qcloud-cos-upload');

const $colors = $gutil.colors;

const PLUGIN_NAME = 'gulp-qcloud-cos-upload';

const isFile = path => $fs.existsSync(path) && $fs.statSync(path).isFile();

const isDir = path => $fs.existsSync(path) && $fs.statSync(path).isDirectory();

const requestParam = {
	AppId: '',
	SecretId: '',
	SecretKey: '',
	Bucket: '',
	Region: ''
};

const upload = options => {
	options = options || {};

	let conf = Object.assign({
		prefix: '',
		debug: false,
		log: true,
		overwrite: false
	}, requestParam, options);

	let nTotal = 0;
	let nSkip = 0;
	let nFailed = 0;
	let nSuccess = 0;

	let hasAllRequestParam = Object.keys(requestParam).every(key => {
		if (!conf[key]) {
			this.emit(
				'error',
				new $gutil.PluginError(PLUGIN_NAME, `Need param: ${key}`)
			);
		}
		return conf[key];
	});

	if (!hasAllRequestParam) { return; }

	return $through.obj(function (file, encoding, callback) {
		if (file.isNull()) {
			callback();
		}

		if (file.isStream()) {
			this.emit(
				'error',
				new $gutil.PluginError(PLUGIN_NAME, 'Streaming not supported')
			);
			callback();
		}

		if (!isDir(file.path) && isFile(file.path)) {
			console.log(file.path);
			let relativePath = $path.relative(file.cwd, file.path);
			let uploadPath = $path.join(conf.prefix, relativePath);
			uploadPath = uploadPath.replace(/\\/g, '/');

			nTotal++;

			let spec = Object.assign({}, conf);
			delete spec.prefix;
			spec.FilePath = file.path;
			spec.Key = uploadPath;

			$qcloudUpload(spec).then(rs => {
				console.log('qcloudUpload done');
				if (rs) {
					if (rs.isExists) {
						nSkip++;
					} else {
						nSuccess++;
					}
				} else {
					nFailed++;
				}
				callback();
			}).catch(err => {
				console.log('qcloudUpload error');
				console.error(err);
				nFailed++;
				callback();
			});
		} else {
			callback();
		}
	}, callback => {
		$gutil.log(
			'Total:', $colors.green(nTotal),
			'Skip:', $colors.gray(nSkip),
			'Success:', $colors.green(nSuccess),
			'Failed:', $colors.red(nFailed)
		);
		callback(null);
	});
};

module.exports = upload;

