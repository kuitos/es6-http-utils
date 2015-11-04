/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-09-21
 * Fetch request api,inspired by angular $http
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _whatwgFetch = require('whatwg-fetch');

var _whatwgFetch2 = _interopRequireDefault(_whatwgFetch);

var _constantsHttpConstantsJs = require('../constants/http-constants.js');

var _utilsObjectUtil = require('../utils/object-util');

var _utilsUrlUtil = require('../utils/url-util');

var _cacheLruCacheJs = require('../cache/lru-cache.js');

var _cacheLruCacheJs2 = _interopRequireDefault(_cacheLruCacheJs);

var fetch = window.fetch;
var Headers = window.Headers;

function getHeadersGetter(headers) {
  headers = new Headers(headers);
  return headers.get.bind(headers);
}

// serialize to json string when payload was an object
function defaultRequestTransformer(data) {
  return (0, _utilsObjectUtil.isObject)(data) && !(0, _utilsObjectUtil.isFile)(data) && !(0, _utilsObjectUtil.isBlob)(data) && !(0, _utilsObjectUtil.isFormData)(data) ? (0, _utilsObjectUtil.toJson)(data) : data;
}

// deserialize response when response content-type was application/json
function defaultResponseTransformer(response, headersGetter) {

  var contentType = headersGetter('Content-Type');

  if (contentType) {

    var isDataConsumed = response.hasOwnProperty('data');

    // because of the Response instance can only consume once,if the response had a data property,it means it had been consumed
    // so we need to get from data property
    if (contentType.indexOf(_constantsHttpConstantsJs.APPLICATION_JSON) === 0) {
      response.data = isDataConsumed ? response.data : response.json();
    } else {
      response.data = isDataConsumed ? response.data : response.text();
    }
    // todo handler more content type of data such as images/form,we need to convert them to blob/formData
  }

  return response;
}

// execute request|response transformers
function executeHttpTransformers(data, headersGetter, status, fns) {

  if ((0, _utilsObjectUtil.isFunction)(fns)) {
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
    if (!(0, _utilsObjectUtil.isFunction)(value) && !(prop in response)) {
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

        if ((0, _utilsObjectUtil.isObject)(value)) {
          if ((0, _utilsObjectUtil.isDate)(value)) {
            value = value.toISOString();
          } else if (Array.isArray(value)) {
            // according to rest specification array should be separated by comma in url
            value = value.join(',');
          } else {
            value = (0, _utilsObjectUtil.toJson)(value);
          }
        }

        queryParams.push((0, _utilsUrlUtil.encodeUriQuery)(key) + '=' + (0, _utilsUrlUtil.encodeUriQuery)(value));
      }
    });

    if (queryParams.length) {
      builtUrl = '' + url + (url.indexOf('?') === -1 ? '?' : '&') + queryParams.join('&');
    }
  }

  return builtUrl;
}

// default cache
var defaultCacheStore = new _cacheLruCacheJs2['default']();

function sendReq(url, requestConfigs) {

  var promise = fetch(url, requestConfigs);

  if (requestConfigs.cacheStore) {

    var cacheStore = (0, _utilsObjectUtil.isObject)(requestConfigs.cacheStore) ? requestConfigs.cacheStore : defaultCacheStore;
    var cacheResp = cacheStore.get(url);

    if (cacheResp) {
      return Promise.resolve(cacheResp);
    } else {
      // we need to store a promise as cache to solve the several async request when they are the same url
      cacheStore.set(url, promise);

      return promise;
    }
  } else {
    return promise;
  }
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

  if (!(0, _utilsUrlUtil.urlIsSameOrigin)(url)) {
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

    return sendReq(url, configsAfterTransform).then(processResponse, processResponse);
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

  cacheStore: false,
  interceptors: [],
  interceptorBlackList: [],
  requestTransformers: [defaultRequestTransformer],
  responseTransformers: [defaultResponseTransformer]

};

exports['default'] = FetchHttp;
module.exports = exports['default'];