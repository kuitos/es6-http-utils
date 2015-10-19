### web-fetch-request
基于web请求新标准[fetch api](https://fetch.spec.whatwg.org/) & [es6 promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)实现的http模块,无任何框架依赖.同时提供es5兼容版本.是替代(拓展)传统ajax请求方式的不二选择.

#### How to install

```bash
npm install web-fetch-request
```

#### API(详见src/demo目录)
* FetchHttp 封装fetch api，提供get｜post｜put｜patch｜delete等基础封装，类似angular的[$http服务](https://docs.angularjs.org/api/ng/service/$http).支持跨域调用.

	|API|Code Example|Network|
	|-----------|-----------|------|
	| FetchHttp(url, method, configs) |FetchHttp('/posts', 'get', {headers:{'content-type':'text/html'}})|GET '/posts'|
	| FetchHttp.get(url, params, configs) |FetchHttp.get('/posts',{postId:1})|GET '/posts?postId=1'|
	| FetchHttp.delete(url, params, configs) |FetchHttp.delete('/posts',{postId:1})|DELETE '/posts?postId=1'|
	| FetchHttp.head(url, params, configs) |FetchHttp.get('/posts',{postId:1})|HEAD '/posts?postId=1'|
	| FetchHttp.post(url, payload, configs) |FetchHttp.post('/posts',{postId:1}, {params:{userId:2}})|POST '/posts?userId=2'| body:{postId:1}
	|FetchHttp.put(url, payload, configs)||
	|FetchHttp.patch(url, payload, configs)||
	
* FetchHttp拦截器及transformer配置
	
	interceptor
	
	```js
	FetchHttp.defaultConfigs.interceptors.push({
	
	  request(request){
	
	    console.log('request success interceptor execute', request);
	    return request;
	  },
	
	  reqeustError(request){
	    console.log('request error interceptor execute', request);
	    return request;
	  },
	
	  response(response){
	    console.log('response success interceptor execute', response);
	    return response;
	  },
	
	  responseError(response){
	    console.log('response error interceptor execute', response);
	    return response;
	  }
	
	});
	```
	
	transformers
	
	```js
	FetchHttp.defaultConfigs.requestTransformers.push((data, headersGetter, status) => {
	
	  console.log('request transformer execute', data, headersGetter, status);
	
	  return data;
	
	});

	FetchHttp.defaultConfigs.responseTransformers.push((data, headersGetter, status) => {
	
	  console.log('response transformer execute', data, headersGetter, status);
	
	  return data;
	
	});
	
	```


* FetchHttpResource 在RequestFetch基础上针对rest api定制的resource构造器，类似angular的ngResource模块，用法跟[$resource](https://docs.angularjs.org/api/ngResource/service/$resource)类似

	|API|Code Example|
	|-----------|-----------|
	| FetchHttpResource(urlTemplate, defaultParams, actions) |new FetchHttpResource('/posts/:postId', {postId:1})|
	
#### 目录说明
	+dist  // es5浏览器兼容版本，可以直接script方式引入
	
	+lib	// babel版本，CommonJS模块规范，可直接require或import
	
	+src	// 源码目录
	
	+demo	// 示例代码
	
	
	
Licence MIT
	
