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

var _whatwgFetch = require('whatwg-fetch');

var _whatwgFetch2 = _interopRequireDefault(_whatwgFetch);

var _constantsHttpConstantsJs = require('../constants/http-constants.js');

var _utilsBaseUtilJs = require('../utils/base-util.js');

var _utilsWebUtilJs = require('../utils/web-util.js');

var fetch = window.fetch,
    Headers = window.Headers;

// 参数为json对象时则作序列化操作
function transformRequest(payload) {
  return (0, _utilsBaseUtilJs.isObject)(payload) && !(0, _utilsBaseUtilJs.isFile)(payload) && !(0, _utilsBaseUtilJs.isBlob)(payload) && !(0, _utilsBaseUtilJs.isFormData)(payload) ? (0, _utilsBaseUtilJs.toJson)(payload) : payload;
}

// 响应头为application/json时作反序列化处理
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

// fetch通用配置
var COMMON_CONFIG = {
  headers: { 'Content-Type': _constantsHttpConstantsJs.APPLICATION_JSON + ';charset=utf-8', 'X-Requested-With': 'https://github.com/kuitos/' },
  mode: 'same-origin',
  credentials: 'same-origin',
  cache: 'no-cache'
};

function FetchRequest(url, method, configs) {

  var init = undefined;

  if (!(0, _utilsWebUtilJs.urlIsSameOrigin)(url)) {
    configs.mode = 'cors';
  }

  // 合并请求头
  configs.headers = Object.assign({}, COMMON_CONFIG.headers, configs.headers);

  // build url
  if (configs.params) {
    url = buildUrl(url, configs.params);
  }

  // 按照restful规范get和delete方法不应该有请求体
  if (~[_constantsHttpConstantsJs.REQUEST_METHODS.GET, _constantsHttpConstantsJs.REQUEST_METHODS.DELETE].indexOf(method)) {
    init = Object.assign({}, COMMON_CONFIG, configs, { method: method });
  } else {
    init = Object.assign({ body: transformRequest(payload) }, COMMON_CONFIG, configs, { method: method });
  }

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