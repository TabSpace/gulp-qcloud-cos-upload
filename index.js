const $fs = require('fs');
const $path = require('path');
const $gutil = require('gulp-util');
const $through = require('through2');
const $qcloudUpload = require('qcloud-cos-upload');

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

	return $through.obj(function (file, encoding, callback) {
		let hasAllRequestParam = Object.keys(requestParam).every(key => {
			if (!conf[key]) {
				this.emit(
					'error',
					new $gutil.PluginError(PLUGIN_NAME, `Need param: ${key}`)
				);
			}
			return conf[key];
		});

		if (!hasAllRequestParam) { return callback(); }

		if (file.isNull()) {
			this.push(file);
			return callback();
		}

		if (file.isStream()) {
			this.emit(
				'error',
				new $gutil.PluginError(PLUGIN_NAME, 'Streaming not supported')
			);
			return callback();
		}

		this.push(file);

		if (!isDir(file.path) && isFile(file.path)) {
			let relativePath = $path.relative(file.cwd, file.path);
			let uploadPath = $path.join(conf.prefix, relativePath);
			uploadPath = uploadPath.replace(/\\/g, '/');

			$qcloudUpload({
				debug: conf.debug,
				log: conf.log,
				overwrite: conf.overwrite,
				AppId: conf.AppId,
				SecretId: conf.SecretId,
				SecretKey: conf.SecretKey,
				Bucket: conf.Bucket,
				Region: conf.Region,
				FilePath: file.path,
				Key: uploadPath
			}).then(() => callback());
		} else {
			callback();
		}
	});
};

module.exports = upload;

