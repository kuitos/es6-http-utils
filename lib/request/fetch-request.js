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

var _whatwgFetch = require('whatwg-fetch');

var _whatwgFetch2 = _interopRequireDefault(_whatwgFetch);

var _constantsHttpConstantsJs = require('../constants/http-constants.js');

var _utilsBaseUtilJs = require('../utils/base-util.js');

var _utilsWebUtilJs = require('../utils/web-util.js');

var fetch = window.fetch,
    Headers = window.Headers;

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

  var parts = [],
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
            value = value.join(',');
          } else {
            value = (0, _utilsBaseUtilJs.toJson)(value);
          }
        }

        parts.push((0, _utilsWebUtilJs.encodeUriQuery)(key) + '=' + (0, _utilsWebUtilJs.encodeUriQuery)(value));
      }
    });

    if (parts.length) {
      builtUrl = '' + url + (url.indexOf('?') === -1 ? '?' : '&') + parts.join('&');
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

  return fetch(url, init).then(function (response) {
    return transformResponse(response);
  });
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