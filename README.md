# gulp-qcloud-cos-upload

[![npm version](https://badge.fury.io/js/gulp-qcloud-cos-upload.svg)](https://www.npmjs.com/package/gulp-qcloud-cos-upload)
[![Build Status](https://travis-ci.org/TabSpace/gulp-qcloud-cos-upload.svg?branch=master)](https://travis-ci.org/TabSpace/gulp-qcloud-cos-upload)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

上传静态资源到腾讯云的 Gulp 插件。

[releases and changelog](https://github.com/TabSpace/gulp-qcloud-cos-upload/releases)

## Tips

基于 [qcloud-cos-upload](https://github.com/TabSpace/qcloud-cos-upload) 实现。

## Demo

![image](http://tabspace.github.io/demo/gulp-qcloud-cos-upload/demo.jpg)

## Getting Started

安装:

```bash
npm i -D gulp-qcloud-cos-upload
```

选项配置参见 [腾讯云存储说明文档](https://cloud.tencent.com/document/product/436/8629)

使用:

```script
const gulp = require('gulp');
const upload = require('gulp-qcloud-cos-upload');

gulp.task(
  'upload',
  () => gulp.src(['**/*'], {
    // 必要参数，用于计算相对路径
    cwd: './temp/files/'
  }).pipe(upload({
    // 日志是否呈现为cdn路径，默认为 ''，设为具体域名可以替换 cdn 域名。
    cdn: true,
    // 是否开启调试模式，默认为 false，调试模式下，报错时输出详细错误信息
    debug: false,
    // 是否在控制台打印上传日志，默认为 true
    log: true,
    // 是否允许文件覆盖，默认为 false
    overwrite: false,
    // 在腾讯云申请的 AppId
    AppId: '1000000000',
    // 配置腾讯云 COS 服务所需的 SecretId
    SecretId: 'AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    // 配置腾讯云 COS 服务所需的 SecretKey
    SecretKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    // COS服务配置的存储桶名称
    Bucket: 'static',
    // 地域名称
    Region: 'ap-chengdu',
    // 前缀路径，所有文件上传到这个路径下
    prefix: 'temp/gulp'
  }))
);
```
