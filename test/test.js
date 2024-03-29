const $fs = require('fs');
const $path = require('path');
const $rp = require('request-promise');
const $assert = require('power-assert');
const $config = require('./config');

const domain = `${$config.Bucket}-${$config.AppId}.coscd.myqcloud.com`;
const perfix = $config.prefix;
const base = 'base';

const tsContent = $fs.readFileSync($path.resolve(__dirname, '../temp/test.js'), 'utf8');
console.log('Local test.js content is:', tsContent);

describe('check-upload', function () {
  this.timeout(20000);

  let test1cosRs = null;
  let test2cosRs = null;

  const test1CosPath = `http://${domain}/${perfix}/test1.js`;
  const test2CosPath = `http://${domain}/${perfix}/test2.js`;

  before(done => {
    $rp(test1CosPath).then(rs => {
      console.log('Remote test1.js content is:', rs);
      test1cosRs = rs;
      return $rp(test2CosPath);
    }).then(rs => {
      console.log('Remote test2.js content is:', rs);
      test2cosRs = rs;
      done();
    }).catch(err => {
      console.error('check-upload error:', err.message);
      done();
    });
  });

  it('File 1 exists', () => {
    $assert(typeof test1cosRs === 'string');
    $assert(test1cosRs.indexOf(tsContent) >= 0);
  });

  it('File 2 exists', () => {
    $assert(typeof test2cosRs === 'string');
    $assert(test2cosRs.indexOf(tsContent) >= 0);
  });
});

describe('check-uploadBase', function () {
  this.timeout(20000);

  let test1cosRs = null;
  const test1CosPath = `http://${domain}/${perfix}/${base}/test1.js`;

  before(done => {
    $rp(test1CosPath).then(rs => {
      console.log('Remote base/test1.js content is:', rs);
      test1cosRs = rs;
      done();
    }).catch(err => {
      console.error('check-upload error:', err.message);
      done();
    });
  });

  it('File 1 exists', () => {
    $assert(typeof test1cosRs === 'string');
    $assert(test1cosRs.indexOf(tsContent) >= 0);
  });
});
