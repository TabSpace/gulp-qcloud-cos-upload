const $rp = require('request-promise');
const $chai = require('chai');
const $mocha = require('mocha');
const $config = require('./config');

const {
	describe,
	it,
	before
} = $mocha;

const timestamp = $config.timestamp || Date.now();
const domain = `${$config.Bucket}-${$config.AppId}.coscd.myqcloud.com`;
const perfix = $config.prefix;

const test1CosPath = `http://${domain}/${perfix}/test1.js`;
const test2CosPath = `http://${domain}/${perfix}/test2.js`;

describe('check-upload', function () {
	this.timeout(20000);

	let noop1cosRs = null;
	let noop2cosRs = null;

	before(done => {
		$rp(test1CosPath).then(rs => {
			noop1cosRs = rs;
			return $rp(test2CosPath);
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

