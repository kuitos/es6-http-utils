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
	
	var _requestFetchRequestResourceJs = __webpack_require__(7);
	
	var _requestFetchRequestResourceJs2 = _interopRequireDefault(_requestFetchRequestResourceJs);
	
	exports.FetchRequest = _requestFetchRequestJs2['default'];
	exports.FetcHttpResource = _requestFetchRequestResourceJs2['default'];

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
	var Request = window.Request;
	var Response = window.Response;
	
	// serialize to json string when payload was an object
	function transformRequest(payload) {
	  return (0, _utilsBaseUtilJs.isObject)(payload) && !(0, _utilsBaseUtilJs.isFile)(payload) && !(0, _utilsBaseUtilJs.isBlob)(payload) && !(0, _utilsBaseUtilJs.isFormData)(payload) ? (0, _utilsBaseUtilJs.toJson)(payload) : payload;
	}
	
	// deserialize response when response content-type was application/json
	function transformResponse(response) {
	
	  var contentType = response.headers.get('Content-Type');
	
	  if (contentType && contentType.indexOf(_constantsHttpConstantsJs.APPLICATION_JSON) === 0) {
	    return response.json();
	  } else {
	    return response;
	  }
	}
	
	function buildUrl(url, params) {
	
	  var queryParams = [],
	      builtUrl = url;
	
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
	
	// fetch api common config
	var COMMON_CONFIG = {
	  headers: { 'Content-Type': _constantsHttpConstantsJs.APPLICATION_JSON + ';charset=utf-8', 'X-Requested-With': 'https://github.com/kuitos/' },
	  mode: 'same-origin',
	  credentials: 'same-origin',
	  cache: 'no-cache'
	};
	
	var FetchRequestConfig = {
	
	  interceptors: []
	
	};
	
	/**
	 *
	 * @param url
	 * @param method
	 * @param configs:
	 *           params: url query params
	 *           data: request payload.
	 * Other configs see https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch
	 * @returns {*|Promise.<response>}
	 * @constructor
	 */
	function FetchRequest(url, method, configs) {
	
	  if (!(0, _utilsWebUtilJs.urlIsSameOrigin)(url)) {
	    configs.mode = 'cors';
	  }
	
	  // merge headers
	  configs.headers = Object.assign({}, COMMON_CONFIG.headers, configs.headers);
	
	  // build url
	  if (configs.params) {
	    url = buildUrl(url, configs.params);
	  }
	
	  var init = Object.assign({ body: transformRequest(configs.data) }, COMMON_CONFIG, configs, { method: method });
	
	  var request = new Request(url, init);
	
	  var serverRequest = function serverRequest(request) {
	    return fetch(request).then(transformResponse, transformResponse);
	  };
	
	  var chain = [serverRequest, undefined];
	  var interceptors = FetchRequestConfig.interceptors;
	
	  while (interceptors.length--) {
	    var a = 10;
	  }
	}
	
	FetchRequest.get = function (url, params) {
	  var configs = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	  configs.params = params;
	  return FetchRequest(url, _constantsHttpConstantsJs.REQUEST_METHODS.GET, configs);
	};
	
	FetchRequest.post = function (url, payload) {
	  var configs = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	  configs.data = payload;
	  return FetchRequest(url, _constantsHttpConstantsJs.REQUEST_METHODS.POST, configs);
	};
	
	FetchRequest.put = function (url, payload) {
	  var configs = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	  configs.data = payload;
	  return FetchRequest(url, _constantsHttpConstantsJs.REQUEST_METHODS.PUT, configs);
	};
	
	FetchRequest.patch = function (url, payload) {
	  var configs = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	  configs.data = payload;
	  return FetchRequest(url, _constantsHttpConstantsJs.REQUEST_METHODS.PATCH, configs);
	};
	
	FetchRequest['delete'] = function (url) {
	  var configs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  return FetchRequest(url, _constantsHttpConstantsJs.REQUEST_METHODS.DELETE, configs);
	};
	
	exports['default'] = FetchRequest;
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
	  DELETE: 'DELETE'
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
	
	function isDate(date) {
	  return toString.call(value) === '[object Date]';
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
	
	var _fetchRequestJs = __webpack_require__(2);
	
	var _fetchRequestJs2 = _interopRequireDefault(_fetchRequestJs);
	
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
	
	var FetchRequestResource =
	
	/**
	 * Resource Constructor
	 * @param urlTemplate
	 * @param defaultParams
	 * @param actions
	 *          {get:{method:...,headers:....}} see fetch api config
	 * @returns {} resource instance
	 */
	function FetcHttpResource(urlTemplate, defaultParams) {
	  var actions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	  _classCallCheck(this, FetcHttpResource);
	
	  var resource = {};
	  // POST|PUT|PATCH can have request body according to rest specification
	  var methodsCanHaveBody = [_constantsHttpConstantsJs.REQUEST_METHODS.POST, _constantsHttpConstantsJs.REQUEST_METHODS.PUT, _constantsHttpConstantsJs.REQUEST_METHODS.PATCH];
	
	  Object.keys(Object.assign(actions, FetcHttpResource.defaults.actions)).forEach(function (actionName) {
	
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
	
	      return (0, _fetchRequestJs2['default'])(url, method, configs).then(function (response) {
	
	        if (!!action.isArray !== Array.isArray(response)) {
	          throw new Error(method + ' request to url:' + url + ' occurred an error in resource configuration for action ' + actionName + '.\n            Expected response to contain an ' + (action.isArray ? 'array' : 'object') + ' but got an ' + (Array.isArray(response) ? 'array' : 'object'));
	        }
	
	        return response;
	      });
	    };
	  });
	
	  return resource;
	}
	
	// resource defaults configurations
	;
	
	FetcHttpResource.defaults = {
	
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
	
	exports['default'] = FetcHttpResource;
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=es6-utils.js.map