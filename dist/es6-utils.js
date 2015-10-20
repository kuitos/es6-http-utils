/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @author Kuitos
	 * @homepage https://github.com/kuitos/
	 * @since 2015-09-30
	 */
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _httpFetchHttpJs = __webpack_require__(2);
	
	var _httpFetchHttpJs2 = _interopRequireDefault(_httpFetchHttpJs);
	
	var _httpFetchHttpResourceJs = __webpack_require__(7);
	
	var _httpFetchHttpResourceJs2 = _interopRequireDefault(_httpFetchHttpResourceJs);
	
	exports.FetchHttp = _httpFetchHttpJs2['default'];
	exports.FetchHttpResource = _httpFetchHttpResourceJs2['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @author Kuitos
	 * @homepage https://github.com/kuitos/
	 * @since 2015-09-21
	 * Fetch request api.Inspired by angular $http
	 */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _whatwgFetch = __webpack_require__(3);
	
	var _whatwgFetch2 = _interopRequireDefault(_whatwgFetch);
	
	var _constantsHttpConstantsJs = __webpack_require__(4);
	
	var _utilsBaseUtilJs = __webpack_require__(5);
	
	var _utilsWebUtilJs = __webpack_require__(6);
	
	var fetch = window.fetch;
	var Headers = window.Headers;
	
	function getHeadersGetter(headers) {
	  headers = new Headers(headers);
	  return headers.get.bind(headers);
	}
	
	// serialize to json string when payload was an object
	function defaultRequestTransformer(data) {
	  return (0, _utilsBaseUtilJs.isObject)(data) && !(0, _utilsBaseUtilJs.isFile)(data) && !(0, _utilsBaseUtilJs.isBlob)(data) && !(0, _utilsBaseUtilJs.isFormData)(data) ? (0, _utilsBaseUtilJs.toJson)(data) : data;
	}
	
	// deserialize response when response content-type was application/json
	function defaultResponseTransformer(response, headersGetter) {
	
	  var contentType = headersGetter('Content-Type');
	
	  if (contentType) {
	    if (contentType.indexOf(_constantsHttpConstantsJs.APPLICATION_JSON) === 0) {
	      response.data = response.json();
	    } else {
	      response.data = response.text();
	    }
	  }
	
	  return response;
	}
	
	// execute request|response transformers
	function executeHttpTransformers(data, headersGetter, status, fns) {
	
	  if ((0, _utilsBaseUtilJs.isFunction)(fns)) {
	    data = fns(data, headersGetter, status);
	  } else {
	    fns.forEach(function (fn) {
	      data = fn(data, headersGetter, status);
	    });
	  }
	
	  return data;
	}
	
	function combineResponseWithRequest(request, response) {
	
	  Object.keys(request).forEach(function (prop) {
	
	    var value = request[prop];
	    // the prop which response not exist and it is not a function will be combine
	    if (!(0, _utilsBaseUtilJs.isFunction)(value) && !(prop in response)) {
	      response[prop] = value;
	    }
	  });
	
	  return response;
	}
	
	/**
	 * process response entity then execute response transformers
	 * @param request request configs
	 * @param response response configs
	 * @returns Promise
	 */
	function transformResponse(request, response) {
	
	  if (response instanceof Error) {
	    throw new TypeError('Response type error when transforming');
	  } else {
	    response = combineResponseWithRequest(request, response);
	    response = executeHttpTransformers(response, getHeadersGetter(response.headers), response.status, response.responseTransformers);
	    return Promise[response.ok ? 'resolve' : 'reject'](response);
	  }
	}
	
	function buildUrl(url, params) {
	
	  var queryParams = [];
	  var builtUrl = url;
	
	  if (params) {
	
	    Object.keys(params).sort().forEach(function (key) {
	
	      var value = params[key];
	
	      // not undefined or null
	      if (value != undefined) {
	
	        if ((0, _utilsBaseUtilJs.isObject)(value)) {
	          if ((0, _utilsBaseUtilJs.isDate)(value)) {
	            value = value.toISOString();
	          } else if (Array.isArray(value)) {
	            // according to rest specification array should be separated by comma in url
	            value = value.join(',');
	          } else {
	            value = (0, _utilsBaseUtilJs.toJson)(value);
	          }
	        }
	
	        queryParams.push((0, _utilsWebUtilJs.encodeUriQuery)(key) + '=' + (0, _utilsWebUtilJs.encodeUriQuery)(value));
	      }
	    });
	
	    if (queryParams.length) {
	      builtUrl = '' + url + (url.indexOf('?') === -1 ? '?' : '&') + queryParams.join('&');
	    }
	  }
	
	  return builtUrl;
	}
	
	/**
	 * @param url
	 * @param method
	 * @param configs:
	 *           params: url query params
	 *           data: request payload.
	 *           headers: customer headers
	 * Other configs see https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch
	 * @returns {*|Promise.<response>}
	 * @constructor
	 */
	function FetchHttp(url, method, configs) {
	
	  if (!(0, _utilsWebUtilJs.urlIsSameOrigin)(url)) {
	    configs.mode = 'cors';
	  }
	
	  // merge headers
	  configs.headers = Object.assign({}, FetchHttp.defaultConfigs.headers, configs.headers);
	  // copy interceptors from default configs
	  configs.interceptors = Array.from(FetchHttp.defaultConfigs.interceptors);
	
	  // merge method/url and other configs
	  configs = Object.assign({ url: url }, FetchHttp.defaultConfigs, configs, { method: method.toUpperCase() });
	
	  // build url
	  if (configs.params) {
	    url = buildUrl(url, configs.params);
	  }
	
	  var serverRequest = function serverRequest(requestConfigs) {
	
	    // execute response transformers
	    var processResponse = function processResponse(response) {
	      return transformResponse(requestConfigs, response);
	    };
	
	    // execute transformers
	    var bodyAfterTransform = executeHttpTransformers(requestConfigs.data, getHeadersGetter(requestConfigs.headers), undefined, requestConfigs.requestTransformers);
	    var configsAfterTransform = Object.assign({ body: bodyAfterTransform }, requestConfigs);
	
	    return fetch(url, configsAfterTransform).then(processResponse, processResponse);
	  };
	
	  // build the request execute chain
	  var chain = [serverRequest, undefined];
	
	  // add interceptors into execute chain which will around the server request
	  var interceptors = configs.interceptors;
	  while (interceptors.length) {
	
	    // The reversal is needed so that we can build up the interception chain around the server request.
	    var interceptor = interceptors.pop();
	
	    if (interceptor.request || interceptor.requestError) {
	      chain.unshift(interceptor.request, interceptor.requestError);
	    }
	
	    if (interceptor.response || interceptor.responseError) {
	      chain.push(interceptor.response, interceptor.responseError);
	    }
	  }
	
	  // execute chain which include interceptors,serverRequest and transformers
	  var promise = Promise.resolve(configs);
	  while (chain.length) {
	
	    var resolveFn = chain.shift();
	    var rejectFn = chain.shift();
	
	    promise = promise.then(resolveFn, rejectFn);
	  }
	
	  // resolve response data entity to caller
	  return promise.then(function (response) {
	    return response.data;
	  }, function (response) {
	    Promise.reject(response);
	  });
	}
	
	/**
	 * FetchHttp short methods
	 */
	(function createShortMethods(names) {
	
	  names.forEach(function (name) {
	
	    FetchHttp[name.toLowerCase()] = function (url, params) {
	      var configs = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	      configs.params = params;
	      return FetchHttp(url, name, configs);
	    };
	  });
	})([_constantsHttpConstantsJs.REQUEST_METHODS.GET, _constantsHttpConstantsJs.REQUEST_METHODS.DELETE, _constantsHttpConstantsJs.REQUEST_METHODS.HEAD]);
	
	(function createShortMethodsWithPayload(names) {
	
	  names.forEach(function (name) {
	
	    FetchHttp[name.toLowerCase()] = function (url, payload) {
	      var configs = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	      configs.data = payload;
	      return FetchHttp(url, _constantsHttpConstantsJs.REQUEST_METHODS.POST, configs);
	    };
	  });
	})([_constantsHttpConstantsJs.REQUEST_METHODS.POST, _constantsHttpConstantsJs.REQUEST_METHODS.PUT, _constantsHttpConstantsJs.REQUEST_METHODS.PATCH]);
	
	/**
	 * FetchHttp configuration
	 */
	FetchHttp.defaultConfigs = {
	
	  headers: {
	    'Content-Type': _constantsHttpConstantsJs.APPLICATION_JSON + ';charset=utf-8',
	    'X-Requested-With': 'https://github.com/kuitos/'
	  },
	  credentials: 'omit',
	  cache: 'no-cache',
	
	  interceptors: [],
	  requestTransformers: [defaultRequestTransformer],
	  responseTransformers: [defaultResponseTransformer]
	
	};
	
	exports['default'] = FetchHttp;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	(function() {
	  'use strict';
	
	  if (self.fetch) {
	    return
	  }
	
	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }
	
	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }
	
	  function Headers(headers) {
	    this.map = {}
	
	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)
	
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }
	
	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var list = this.map[name]
	    if (!list) {
	      list = []
	      this.map[name] = list
	    }
	    list.push(value)
	  }
	
	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }
	
	  Headers.prototype.get = function(name) {
	    var values = this.map[normalizeName(name)]
	    return values ? values[0] : null
	  }
	
	  Headers.prototype.getAll = function(name) {
	    return this.map[normalizeName(name)] || []
	  }
	
	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }
	
	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)]
	  }
	
	  Headers.prototype.forEach = function(callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function(name) {
	      this.map[name].forEach(function(value) {
	        callback.call(thisArg, value, name, this)
	      }, this)
	    }, this)
	  }
	
	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }
	
	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }
	
	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    reader.readAsArrayBuffer(blob)
	    return fileReaderReady(reader)
	  }
	
	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    reader.readAsText(blob)
	    return fileReaderReady(reader)
	  }
	
	  var support = {
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob();
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self
	  }
	
	  function Body() {
	    this.bodyUsed = false
	
	
	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (!body) {
	        this._bodyText = ''
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }
	    }
	
	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }
	
	      this.arrayBuffer = function() {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }
	
	      this.text = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob)
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text')
	        } else {
	          return Promise.resolve(this._bodyText)
	        }
	      }
	    } else {
	      this.text = function() {
	        var rejected = consumed(this)
	        return rejected ? rejected : Promise.resolve(this._bodyText)
	      }
	    }
	
	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }
	
	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }
	
	    return this
	  }
	
	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
	
	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }
	
	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = input
	    }
	
	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null
	
	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }
	
	  Request.prototype.clone = function() {
	    return new Request(this)
	  }
	
	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }
	
	  function headers(xhr) {
	    var head = new Headers()
	    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
	    pairs.forEach(function(header) {
	      var split = header.trim().split(':')
	      var key = split.shift().trim()
	      var value = split.join(':').trim()
	      head.append(key, value)
	    })
	    return head
	  }
	
	  Body.call(Request.prototype)
	
	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }
	
	    this._initBody(bodyInit)
	    this.type = 'default'
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	  }
	
	  Body.call(Response.prototype)
	
	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }
	
	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }
	
	  var redirectStatuses = [301, 302, 303, 307, 308]
	
	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }
	
	    return new Response(null, {status: status, headers: {location: url}})
	  }
	
	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;
	
	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input
	      } else {
	        request = new Request(input, init)
	      }
	
	      var xhr = new XMLHttpRequest()
	
	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL
	        }
	
	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL')
	        }
	
	        return;
	      }
	
	      xhr.onload = function() {
	        var status = (xhr.status === 1223) ? 204 : xhr.status
	        if (status < 100 || status > 599) {
	          reject(new TypeError('Network request failed'))
	          return
	        }
	        var options = {
	          status: status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        }
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options))
	      }
	
	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.open(request.method, request.url, true)
	
	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }
	
	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }
	
	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })
	
	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})();


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * @author Kuitos
	 * @homepage https://github.com/kuitos/
	 * @since 2015-10-14
	 * http相关的常量
	 */
	
	// 请求方法类型
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var REQUEST_METHODS = {
	  GET: 'GET',
	  POST: 'POST',
	  PUT: 'PUT',
	  PATCH: 'PATCH',
	  DELETE: 'DELETE',
	  HEAD: 'HEAD'
	};
	
	exports.REQUEST_METHODS = REQUEST_METHODS;
	var APPLICATION_JSON = 'application/json';
	exports.APPLICATION_JSON = APPLICATION_JSON;

/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * @author Kuitos
	 * @homepage https://github.com/kuitos/
	 * @since 2015-10-14
	 */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.isString = isString;
	exports.isObject = isObject;
	exports.isFunction = isFunction;
	exports.isDate = isDate;
	exports.isFile = isFile;
	exports.isBlob = isBlob;
	exports.isFormData = isFormData;
	exports.toJson = toJson;
	var toString = Object.prototype.toString;
	
	function isString(string) {
	  return typeof string === 'string';
	}
	
	function isObject(value) {
	  return value !== null && typeof value === 'object';
	}
	
	function isFunction(fn) {
	  return typeof fn === 'function';
	}
	
	function isDate(date) {
	  return toString.call(date) === '[object Date]';
	}
	
	function isFile(obj) {
	  return toString.call(obj) === '[object File]';
	}
	
	function isBlob(obj) {
	  return toString.call(obj) === '[object Blob]';
	}
	
	function isFormData(obj) {
	  return toString.call(obj) === '[object FormData]';
	}
	
	function toJson(obj) {
	  if (obj !== undefined) {
	    return JSON.stringify(obj);
	  }
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @author Kuitos
	 * @homepage https://github.com/kuitos/
	 * @since 2015-10-14
	 */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.urlResolve = urlResolve;
	exports.urlIsSameOrigin = urlIsSameOrigin;
	exports.encodeUriSegment = encodeUriSegment;
	exports.encodeUriQuery = encodeUriQuery;
	
	var _baseUtilJs = __webpack_require__(5);
	
	/**
	 * url parser
	 * @see https://github.com/angular/angular.js/blob/master/src%2Fng%2FurlUtils.js
	 */
	var msie = document.documentMode,
	    urlParsingNode = document.createElement('a'),
	    originUrl = urlResolve(window.location.href);
	
	function urlResolve(url) {
	
	  var href = url;
	
	  if (msie) {
	    // Normalize before parse.  Refer Implementation Notes on why this is
	    // done in two steps on IE.
	    urlParsingNode.setAttribute('href', href);
	    href = urlParsingNode.href;
	  }
	
	  urlParsingNode.setAttribute('href', href);
	
	  // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	  return {
	    href: urlParsingNode.href,
	    protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	    host: urlParsingNode.host,
	    search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	    hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	    hostname: urlParsingNode.hostname,
	    port: urlParsingNode.port,
	    pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
	  };
	}
	
	function urlIsSameOrigin(requestUrl) {
	  var parsed = (0, _baseUtilJs.isString)(requestUrl) ? urlResolve(requestUrl) : requestUrl;
	  return parsed.protocol === originUrl.protocol && parsed.host === originUrl.host;
	}
	
	/**
	 * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
	 * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set
	 * (pchar) allowed in path segments:
	 *    segment       = *pchar
	 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
	 *    pct-encoded   = "%" HEXDIG HEXDIG
	 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
	 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
	 *                     / "*" / "+" / "," / ";" / "="
	 */
	
	function encodeUriSegment(val) {
	  return encodeUriQuery(val, true).replace(/%26/gi, '&').replace(/%3D/gi, '=').replace(/%2B/gi, '+');
	}
	
	/**
	 * This method is intended for encoding *key* or *value* parts of query component. We need a custom
	 * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
	 * encoded per http://tools.ietf.org/html/rfc3986:
	 *    query       = *( pchar / "/" / "?" )
	 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
	 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
	 *    pct-encoded   = "%" HEXDIG HEXDIG
	 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
	 *                     / "*" / "+" / "," / ";" / "="
	 */
	
	function encodeUriQuery(val, pctEncodeSpaces) {
	  return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%3B/gi, ';').replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @author Kuitos
	 * @homepage https://github.com/kuitos/
	 * @since 2015-10-14
	 * restful like use fetch api,inspired by ngResource
	 */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _fetchHttpJs = __webpack_require__(2);
	
	var _fetchHttpJs2 = _interopRequireDefault(_fetchHttpJs);
	
	var _constantsHttpConstantsJs = __webpack_require__(4);
	
	var _utilsWebUtilJs = __webpack_require__(6);
	
	/**
	 * use params to fill the url template
	 * @param urlTemplate
	 * @param params
	 * @returns filled url template
	 */
	function genUrlFromTemplate(urlTemplate, params) {
	
	  var generatedUrl = urlTemplate.replace(/:\w+/g, function (match) {
	    var key = match.substr(1);
	    return params[key] !== undefined ? (0, _utilsWebUtilJs.encodeUriSegment)(params[key]) : '';
	  });
	
	  generatedUrl = generatedUrl.replace(/\/\//g, '/');
	
	  return generatedUrl;
	}
	
	/**
	 * get the rest params after url template use up
	 * @param urlTemplate
	 * @param params
	 * @returns rest params
	 */
	function getRestParamsFromUrlTemplate(urlTemplate, params) {
	
	  var restParams = Object.assign({}, params);
	
	  (urlTemplate.match(/:\w+/g) || []).forEach(function (key) {
	    delete restParams[key.substr(1)];
	  });
	
	  return restParams;
	}
	
	var FetchHttpResource =
	
	/**
	 * Resource Constructor
	 * @param urlTemplate
	 * @param defaultParams
	 * @param actions
	 *          {get:{method:...,headers:....}} see fetch api config
	 * @returns {} resource instance
	 */
	function FetchHttpResource(urlTemplate, defaultParams) {
	  var actions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	  _classCallCheck(this, FetchHttpResource);
	
	  var resource = {};
	  // POST|PUT|PATCH can have request body according to rest specification
	  var methodsCanHaveBody = [_constantsHttpConstantsJs.REQUEST_METHODS.POST, _constantsHttpConstantsJs.REQUEST_METHODS.PUT, _constantsHttpConstantsJs.REQUEST_METHODS.PATCH];
	
	  Object.keys(Object.assign(actions, FetchHttpResource.defaults.actions)).forEach(function (actionName) {
	
	    /**
	     * generate resource method
	     * @returns {Promise.<response>}
	     */
	    resource[actionName] = function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }
	
	      var configs = {},
	          action = actions[actionName],
	          method = action.method,
	          hasBody = !! ~methodsCanHaveBody.indexOf(method),
	          params = undefined;
	
	      switch (args.length) {
	
	        case 2:
	          params = args[0];
	          configs.data = args[1];
	          break;
	
	        case 1:
	          if (hasBody) {
	            configs.data = args[0];
	          } else {
	            params = args[0];
	          }
	          break;
	
	        case 0:
	          break;
	
	        default:
	          throw new Error('unexpected arguments!');
	
	      }
	
	      // fill configs from action
	      Object.keys(action).forEach(function (prop) {
	
	        if (prop !== 'isArray') {
	          configs[prop] = action[prop];
	        }
	      });
	
	      var extractParams = Object.assign({}, defaultParams, params);
	      var url = genUrlFromTemplate(urlTemplate, extractParams);
	
	      configs.params = getRestParamsFromUrlTemplate(urlTemplate, extractParams);
	
	      return (0, _fetchHttpJs2['default'])(url, method, configs).then(function (response) {
	
	        if (!!action.isArray !== Array.isArray(response)) {
	          throw new Error(method + ' request to url:' + url + ' occurred an error in resource configuration for action ' + actionName + '.' + ('Expected response to contain an ' + (action.isArray ? 'array' : 'object') + ' but got an ' + (Array.isArray(response) ? 'array' : 'object')));
	        }
	
	        return response;
	      });
	    };
	  });
	
	  return resource;
	}
	
	// resource defaults configurations
	;
	
	FetchHttpResource.defaults = {
	
	  actions: {
	    'get': { method: _constantsHttpConstantsJs.REQUEST_METHODS.GET },
	    'query': { method: _constantsHttpConstantsJs.REQUEST_METHODS.GET, isArray: true },
	    'save': { method: _constantsHttpConstantsJs.REQUEST_METHODS.POST },
	    'update': { method: _constantsHttpConstantsJs.REQUEST_METHODS.PUT },
	    'partUpdate': { method: _constantsHttpConstantsJs.REQUEST_METHODS.PATCH },
	    'delete': { method: _constantsHttpConstantsJs.REQUEST_METHODS.DELETE }, // physical delete
	    'remove': { method: _constantsHttpConstantsJs.REQUEST_METHODS.DELETE } // logical delete
	  }
	
	};
	
	exports['default'] = FetchHttpResource;
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=es6-utils.js.map