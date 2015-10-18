### web-fetch-request
基于web请求新标准fetch api实现的http模块,纯ES6实现,无任何框架依赖.同时提供es5兼容版本.是替代(拓展)传统ajax请求方式的不二选择.


#### How to install

```bash
npm install web-fetch-request
```

#### 工具说明

* 一个网络请求模块，基于[fetch api](https://fetch.spec.whatwg.org/) & [es6 promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise),可直接替代ajax
	* FetchHttp 封装fetch api，提供get｜post｜put｜patch｜delete等基础封装，类似angular的[$http服务](https://docs.angularjs.org/api/ng/service/$http).支持跨域调用.
	* FetchHttpResource 在RequestFetch基础上针对rest api定制的resource构造器，类似angular的ngResource模块，用法跟[$resource](https://docs.angularjs.org/api/ngResource/service/$resource)类似


#### 目录说明
	+dist  // es5浏览器兼容版本，可以直接script方式引入
	
	+lib	// babel版本，CommonJS模块规范，可直接require或import
	
	+src	// 源码目录
	
	+test	// 测试用例
	
	
	
Licence MIT
	
