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
	
	var _requestFetchRequestJs = __webpack_require__(2);
	
	var _requestFetchRequestJs2 = _interopRequireDefault(_requestFetchRequestJs);
	
	exports.FetchRequest = _requestFetchRequestJs2['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @author Kuitos
	 * @homepage https://github.com/kuitos/
	 * @since 2015-09-21
	 * inspired by angular $http
	 * fetch request api基础封装
	 */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _whatwgFetch = __webpack_require__(3);
	
	var _whatwgFetch2 = _interopRequireDefault(_whatwgFetch);
	
	var fetch = window.fetch,
	    Headers = window.Headers;
	
	var toString = Object.prototype.toString;
	
	function isString(string) {
	  return typeof string === 'string';
	}
	
	function isObject(value) {
	  return value !== null && typeof value === 'object';
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
	  var parsed = isString(requestUrl) ? urlResolve(requestUrl) : requestUrl;
	  return parsed.protocol === originUrl.protocol && parsed.host === originUrl.host;
	}
	
	// 参数为json对象时则作序列化操作
	function transformRequest(payload) {
	  return isObject(payload) && !isFile(payload) && !isBlob(payload) && !isFormData(payload) ? toJson(payload) : payload;
	}
	
	// 响应头为application/json时作反序列化处理
	function transformResponse(response) {
	
	  var contentType = response.headers.get('Content-Type');
	
	  if (contentType && contentType.indexOf(APPLICATION_JSON) === 0) {
	    return response.json();
	  } else {
	    return response;
	  }
	}
	
	// 请求方法类型
	var REQUEST_METHODS = {
	  GET: 'GET',
	  POST: 'POST',
	  PUT: 'PUT',
	  PATCH: 'PATCH',
	  DELETE: 'DELETE'
	};
	
	var APPLICATION_JSON = 'application/json';
	
	// fetch通用配置
	var COMMON_CONFIG = {
	  headers: { 'Content-Type': APPLICATION_JSON + ';charset=utf-8', 'X-Requested-With': 'https://github.com/kuitos/' },
	  mode: 'same-origin',
	  credentials: 'same-origin',
	  cache: 'no-cache'
	};
	
	function sendReq(url, method, payload, configs) {
	
	  var init = undefined;
	
	  if (!urlIsSameOrigin(url)) {
	    configs.mode = 'cors';
	  }
	
	  // 合并请求头
	  configs.headers = Object.assign({}, COMMON_CONFIG.headers, configs.headers);
	
	  // get和delete方法不允许有请求体
	  if (~[REQUEST_METHODS.GET, REQUEST_METHODS.DELETE].indexOf(method)) {
	    init = Object.assign({}, COMMON_CONFIG, configs, { method: method });
	  } else {
	    init = Object.assign({ body: transformRequest(payload) }, COMMON_CONFIG, configs, { method: method });
	  }
	
	  return fetch(url, init).then(function (response) {
	    return transformResponse(response);
	  });
	}
	
	exports['default'] = {
	
	  get: function get(url) {
	    var configs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    return sendReq(url, REQUEST_METHODS.GET, undefined, configs);
	  },
	
	  post: function post(url, payload) {
	    var configs = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	    return sendReq(url, REQUEST_METHODS.POST, payload, configs);
	  },
	
	  put: function put(url, payload) {
	    var configs = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	    return sendReq(url, REQUEST_METHODS.PUT, payload, configs);
	  },
	
	  patch: function patch(url, payload) {
	    var configs = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	    return sendReq(url, REQUEST_METHODS.PATCH, payload, configs);
	  },
	
	  'delete': function _delete(url) {
	    var configs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    return sendReq(url, REQUEST_METHODS.DELETE, undefined, configs);
	  }
	
	};
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
	      name = name.toString();
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }
	
	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = value.toString();
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
	
	  function Request(url, options) {
	    options = options || {}
	    this.url = url
	
	    this.credentials = options.credentials || 'omit'
	    this.headers = new Headers(options.headers)
	    this.method = normalizeMethod(options.method || 'GET')
	    this.mode = options.mode || null
	    this.referrer = null
	
	    if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(options.body)
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
	    this.url = null
	    this.status = options.status
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = options.statusText
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
	    this.url = options.url || ''
	  }
	
	  Body.call(Response.prototype)
	
	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;
	
	  self.fetch = function(input, init) {
	    // TODO: Request constructor should accept input, init
	    var request
	    if (Request.prototype.isPrototypeOf(input) && !init) {
	      request = input
	    } else {
	      request = new Request(input, init)
	    }
	
	    return new Promise(function(resolve, reject) {
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


/***/ }
/******/ ]);
//# sourceMappingURL=es6-utils.js.map