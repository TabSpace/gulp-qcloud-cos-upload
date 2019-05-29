const $fs = require('fs');
const $path = require('path');
const $through = require('through2');
const $qcloudUpload = require('qcloud-cos-upload');
const $chalk = require('chalk');
const $log = require('fancy-log');
const $PluginError = require('plugin-error');

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
				new $PluginError(PLUGIN_NAME, `Need param: ${key}`)
			);
		}
		return conf[key];
	});

	if (!hasAllRequestParam) { return; }

	let stream = $through.obj(function (file, encoding, callback) {
		if (file.isNull()) {
			callback();
		}

		if (file.isStream()) {
			this.emit(
				'error',
				new $PluginError(PLUGIN_NAME, 'Streaming not supported')
			);
			callback();
		}

		if (!isDir(file.path) && isFile(file.path)) {
			let base = '';
			if (file.base.indexOf($path.dirname(file.path)) === 0) {
				base = '';
			} else {
				base = file.base;
			}

			let relativePath = $path.relative(file.cwd, file.path);
			let uploadPath = $path.join(conf.prefix, base, relativePath);
			uploadPath = uploadPath.replace(/\\/g, '/');

			nTotal++;

			let spec = Object.assign({}, conf);
			spec.FilePath = file.path;
			spec.Key = uploadPath;

			$qcloudUpload(spec).then(rs => {
				if (rs) {
					if (rs.isExists && !rs.uploaded) {
						nSkip++;
					} else {
						nSuccess++;
					}
				} else {
					nFailed++;
				}
				setTimeout(callback);
			}).catch(err => {
				console.error(err);
				nFailed++;
				setTimeout(callback);
			});
		} else {
			callback();
		}
	}, callback => {
		$log(
			'Total:', $chalk.green(nTotal),
			'Skip:', $chalk.gray(nSkip),
			'Success:', $chalk.green(nSuccess),
			'Failed:', $chalk.red(nFailed)
		);
		setTimeout(callback);
	});

	return stream;
};

module.exports = upload;

