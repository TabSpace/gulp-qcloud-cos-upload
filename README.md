# gulp-qcloud-cos-upload
上传静态资源到腾讯云的 Gulp 插件

[![npm version](https://badge.fury.io/js/gulp-qcloud-cos-upload.svg)](https://www.npmjs.com/package/gulp-qcloud-cos-upload)

适配腾讯云官方 COS Nodejs SDK（XML API） [cos-nodejs-sdk-v5](https://github.com/tencentyun/cos-nodejs-sdk-v5)

## Demo

![image](http://tabspace.github.io/demo/gulp-qcloud-cos-upload/demo.jpg)

## Getting Started

安装:

```shell
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

## Release History

 * 2018-05-08 v1.0.4 更新腾讯云sdk
 * 2018-03-02 v1.0.1 解决 gulp.src 使用通配符有可能无法遍历所有文件的情况
 * 2017-11-09 v1.0.0 发布第一个正式版


