const $rp = require('request-promise');
const $chai = require('chai');
const $mocha = require('mocha');
const $config = require('../temp/config');

const {
	describe,
	it,
	before
} = $mocha;

const timestamp = $config.timestamp || Date.now();
const domain = `${$config.Bucket}-${$config.AppId}.coscd.myqcloud.com`;
const perfix = 'temp/gulp';

const noop1CosPath = `http://${domain}/${perfix}/noop1.js`;
const noop2CosPath = `http://${domain}/${perfix}/noop2.js`;

describe('config', () => {
	it('config.AppId should be a string', () => {
		$chai.expect($config.AppId).to.be.a('string');
	});

	it('config.SecretId should be a string', () => {
		$chai.expect($config.SecretId).to.be.a('string');
	});

	it('config.SecretKey should be a string', () => {
		$chai.expect($config.SecretKey).to.be.a('string');
	});

	it('config.Bucket should be a string', () => {
		$chai.expect($config.Bucket).to.be.a('string');
	});

	it('config.Region should be a string', () => {
		$chai.expect($config.Region).to.be.a('string');
	});
});

describe('check-upload', function () {
	this.timeout(5000);

	let noop1cosRs = null;
	let noop2cosRs = null;

	before(done => {
		$rp(noop1CosPath).then(rs => {
			noop1cosRs = rs;
			return $rp(noop2CosPath);
		}).then(rs => {
			noop2cosRs = rs;
			done();
		}).catch(err => {
			console.error('check-upload error:', err.message);
			done();
		});
	});

	it('File 1 exists', () => {
		console.log('check-upload noop1cosRs', noop1cosRs);
		$chai.expect(noop1cosRs).to.be.a('string');
		$chai.expect(noop1cosRs).to.not.include(timestamp);
	});

	it('File 2 exists', () => {
		console.log('check-upload noop2cosRs', noop2cosRs);
		$chai.expect(noop2cosRs).to.be.a('string');
		$chai.expect(noop2cosRs).to.not.include(timestamp);
	});
});

